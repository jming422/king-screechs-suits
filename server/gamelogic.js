/* eslint-disable no-unused-vars */

import _ from 'lodash';

import * as db from './db.js';

import * as gm from './models/games.js';

// These functions are called in response to websocket messages. They must
// validate whether the requested action is valid given the current game state.
// If it isn't, they should return `false`. If it is, then they should compute
// and commit the new game state to the database, and then return `true`.

export async function resolveAbility(gameId, playerId, ability) {
  const prevState = (await gm.getById(gameId)).state;
}

export async function resolveDraw(gameId, playerId, pile) {
  // Shortcut if requested pile type is invalid
  if (!['color', 'basic'].includes('pile')) return false;

  return await db.txn(async (conn) => {
    const prevState = (await gm.getById(gameId, conn)).state;

    // If it isn't this player's turn then they can't draw
    if (prevState.playerStates[playerId] !== 'playing') return false;

    const drawPile = prevState.zones.draw[pile];
    const minSize = pile === 'basic' ? 3 : 1;

    const newState = _.cloneDeep(prevState);

    if (drawPile.length < minSize) {
      // If the color pile doesn't have enough cards to draw out of, then this move
      // is invalid
      if (pile === 'color') return false;

      // If the basic pile doesn't have enough cards to draw, though, then the basic
      // discard gets reshuffled into the draw
      const cardsNeededFromReshuffle = minSize - drawPile.length;
      const reshuffledCards = _.shuffle(prevState.zones.discard.basic.slice(3));
      const newDiscard = prevState.zones.discard.basic.slice(0, 3);
      const newPile = reshuffledCards.slice(cardsNeededFromReshuffle);
      const newHand = prevState.zones.players[playerId].hand.concat(
        drawPile,
        reshuffledCards.slice(0, cardsNeededFromReshuffle)
      );

      newState.zones.discard[pile] = newDiscard;
      newState.zones.draw[pile] = newPile;
      newState.zones.players[playerId].hand = newHand;
    } else {
      // We have enough cards to draw from so just draw
      const newPile = drawPile.slice(0, -minSize);
      const newHand = prevState.zones.players[playerId].hand.concat(
        drawPile.slice(-minSize)
      );

      newState.zones.draw[pile] = newPile;
      newState.zones.players[playerId].hand = newHand;
    }

    await gm.update(gameId, { state: newState }, conn);
    return true;
  }, 'SERIALIZABLE');
}

export async function resolveMatch(gameId, playerId, cardIds) {
  const prevState = (await gm.getById(gameId)).state;
}

export async function resolveDiscard(gameId, playerId, cardIds) {
  if (!cardIds?.length) return false;
  return await db.txn(async (conn) => {
    const prevState = (await gm.getById(gameId, conn)).state;
    if (
      ['discarding', 'waiting', 'playing'].includes(
        prevState.playerStates[playerId]
      )
    )
      return false;

    const discarding = new Set(cardIds);
    const [toDiscard, newHand] = _.partition(
      prevState.zones.players[playerId].hand,
      ({ cardId }) => discarding.has(cardId)
    );

    if (toDiscard.length !== discarding.size) {
      // If the number of cards in hand that we're discarding doesn't match the
      // number of cards requested, then that means we were requested to discard a
      // card that wasn't in hand! This is invalid.
      return false;
    }

    const [discardingBasic, discardingColor] = _.partition(
      toDiscard,
      'isBasic'
    );

    const newState = _.cloneDeep(prevState);

    const newBasicDiscard = _(discardingBasic)
      .reverse()
      .concat(prevState.zones.discard.basic)
      .value();

    const newColorDiscard = _(discardingColor)
      .reverse()
      .concat(prevState.zones.discard.color)
      .value();

    newState.zones.players[playerId].hand = newHand;
    newState.zones.discard.basic = newBasicDiscard;
    newState.zones.discard.color = newColorDiscard;

    await gm.update(gameId, { state: newState }, conn);
    return true;
  }, 'SERIALIZABLE');
}

const exampleGameState = {
  buffs: {
    players: {
      one: [
        {
          handSize: 1,
          turns: -1,
          slowAndSteady: 1,
          timer: { turns: 2, action: {} },
        },
      ],
    },
  },
  playerStates: {
    one: `won | lost | waiting | discarding | playing | disconnected | forfeited`,
  },
  turnOrder: ['one'],
  zones: {
    players: {
      one: {
        hand: ['cards'],
        matches: [],
        reserve: [],
      },
    },
    draw: {
      color: [],
      basic: [],
    },
    discard: {
      color: [],
      basic: [],
    },
    pot: [],
  },
};
