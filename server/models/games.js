import _ from 'lodash';
import camelcase from 'camelcase';
import camelcaseKeys from 'camelcase-keys';

import * as db from '../db.js';

const SUITS = ['heart', 'diamond', 'spade', 'club'];

const BASIC_CARDS = _.range(1, 53).map((n) => ({
  cardId: `b${n}`,
  isBasic: true,
  rank: n % 14,
  suit: SUITS[Math.floor(n / 14)],
}));

const DEFAULT_STATE = {
  buffs: { players: {} },
  zones: {
    pot: [],
    draw: { basic: BASIC_CARDS.map(({ cardId }) => cardId), color: [] },
    discard: { basic: [], color: [] },
    players: {},
  },
  turnOrder: [],
  playerStates: {},
};

/** All columns */
// const COLS = ['game_id', 'code', 'state'];

/** Editable columns */
const ECOLS = ['state'];

// Yeah not gonna let these through
const NOPE = [
  [70, 85, 67, 75],
  [83, 72, 73, 84],
  [83, 72, 65, 84],
  [67, 85, 78, 84],
  [68, 73, 67, 75],
];

function randomCode() {
  let codeChars;
  do {
    // Start with 4 A's as char codes, then randomly inc each by 0-25
    codeChars = [65, 65, 65, 65].map((c) => c + Math.floor(26 * Math.random()));
  } while (NOPE.some((nope) => _.isEqual(nope, codeChars)));

  return codeChars
    .map((c) => String.fromCharCode(c)) // Convert to character strings
    .join(''); // Join characters into one four-letter code
}

export async function create(deckIds) {
  return await db.txn(async (conn) => {
    const { rows: existing } = await conn.query('SELECT code FROM games');
    const existingCodes = new Set(existing.map(({ code }) => code));
    let code;
    do {
      code = randomCode();
    } while (existingCodes.has(code));

    const {
      rows: [game],
    } = await conn.query('INSERT INTO games (code) VALUES ($1) RETURNING *', [
      code,
    ]);

    if (!deckIds) {
      const { rows } = await conn.query('SELECT deck_id FROM decks');
      deckIds = rows.map(({ deck_id }) => deck_id);
    }

    if (deckIds.length) {
      const values = [];
      const r = db.replacementsHelper(values);
      const gid = r(game.game_id);
      await conn.query(
        `INSERT INTO game_decks (game_id, deck_id)
         VALUES ${deckIds.map((id) => `(${gid}, ${r(id)})`).join()}`,
        values
      );
    }

    const { rows: cards } = await conn.query(
      'SELECT * FROM cards NATURAL JOIN deck_cards WHERE deck_id = ANY ($1)',
      [deckIds]
    );

    const initialState = _.cloneDeep(DEFAULT_STATE);
    initialState.zones.draw.color = cards.map(({ card_id }) => card_id);
    // basic cards already in their draw in DEFAULT_STATE

    await conn.query(`UPDATE games SET state = $2::jsonb WHERE game_id = $1`, [
      game.game_id,
      initialState,
    ]);

    return {
      game: camelcaseKeys(game),
      cards: { color: camelcaseKeys(cards), basic: _.cloneDeep(BASIC_CARDS) },
    };
  });
}

export async function join(gameId, playerName) {
  return await db.txn(async (conn) => {
    const { rows } = await conn.query(
      'SELECT EXISTS(SELECT 1 FROM games WHERE game_id = $1)',
      [gameId]
    );
    if (!rows[0]?.exists) return null;

    const {
      rows: [{ player_id: playerId }],
    } = await conn.query(
      'INSERT INTO players (name) VALUES ($1) RETURNING player_id',
      [playerName]
    );

    await conn.query(
      'INSERT INTO game_players (game_id, player_id) VALUES ($1, $2)',
      [gameId, playerId]
    );

    return playerId;
  });
}

export async function read(code, conn) {
  const { rows } = await (conn ?? db).query(
    'SELECT * FROM games WHERE code = $1',
    [code]
  );
  return rows[0] ? camelcaseKeys(rows[0]) : null;
}

export async function getCards(gameId) {
  const { rows } = db.query(
    `SELECT c.* FROM cards AS c
     NATURAL JOIN deck_cards
     NATURAL JOIN game_decks
     WHERE game_id = $1`,
    [gameId]
  );

  return { color: camelcaseKeys(rows), basic: _.cloneDeep(BASIC_CARDS) };
}

export async function getById(gameId, conn) {
  const { rows } = await (conn ?? db).query(
    'SELECT * FROM games WHERE game_id = $1',
    [gameId]
  );
  return rows[0] ? camelcaseKeys(rows[0]) : null;
}

export async function update(gameId, updates, conn) {
  const values = [];
  const r = db.replacementsHelper(values);

  const ups = _(ECOLS)
    .map((sc) => {
      const up = updates[camelcase(sc)];
      return up !== undefined && `${sc} = ${r(up)}`;
    })
    .compact()
    .join();

  if (!ups) return 0;

  const { rowCount } = await (conn ?? db).query(
    `UPDATE games SET ${ups} WHERE game_id = ${r(gameId)}`,
    values
  );

  return rowCount;
}

export async function del(code, conn) {
  const { rowCount } = await (conn ?? db).query(
    'DELETE FROM games WHERE code = $1',
    [code]
  );
  return rowCount;
}
