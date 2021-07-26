/* eslint-disable no-unused-vars */

// These functions are called in response to websocket messages. They must
// validate whether the requested action is valid given the current game state.
// If it isn't, they should return `false`. If it is, then they should compute
// and commit the new game state to the database, and then return `true`.

export async function resolveAbility(gameId, playerId, ability) {
  // todo
}

export async function resolveDraw(gameId, playerId, pile) {
  // todo
}

export async function resolveMatch(gameId, playerId, cards) {
  // todo
}

export async function resolveDiscard(gameId, playerId, cards) {
  // todo
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
    one: `won | lost | discarding | playing | disconnected | forfeited`,
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
