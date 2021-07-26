import _ from 'lodash';
import camelcase from 'camelcase';
import camelcaseKeys from 'camelcase-keys';

import * as db from '../db.js';

/** All columns */
// const COLS = ['game_id', 'code', 'state'];

/** Editable columns */
const ECOLS = ['state'];

export async function create(deckIds) {
  return await db.txn(async (conn) => {
    const {
      rows: [game],
    } = await conn.query('INSERT INTO games DEFAULT VALUES RETURNING *');

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

    return camelcaseKeys(game);
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

export async function read(code) {
  const { rows } = await db.query('SELECT * FROM games WHERE code = $1', [
    code,
  ]);
  return rows[0] ? camelcaseKeys(rows[0]) : null;
}

export async function update(code, updates) {
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

  const { rowCount } = await db.query(
    `UPDATE games SET ${ups} WHERE code = ${r(code)}`,
    values
  );

  return rowCount;
}

export async function del(code) {
  const { rowCount } = await db.query('DELETE FROM games WHERE code = $1', [
    code,
  ]);
  return rowCount;
}
