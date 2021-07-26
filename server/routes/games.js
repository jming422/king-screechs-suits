import Router from 'koa-router';

import * as m from '../models/games.js';

const gamesApi = new Router();

gamesApi.post('/', async (ctx) => {
  const {
    request: { body },
  } = ctx;
  console.log('starting new game');

  const playerName = body?.playerName?.trim();

  if (!playerName) {
    return ctx.badRequest('Must provide a player name');
  }

  const game = await m.create();
  const playerId = await m.join(game.gameId, playerName);

  return ctx.ok({ game, playerId });
});

gamesApi.post('/join/:code', async (ctx) => {
  const {
    params: { code },
    request: { body },
  } = ctx;

  console.log(`request to join game ${code}`);

  const playerName = body?.playerName?.trim();

  if (!playerName) {
    return ctx.badRequest('Must provide a player name');
  }

  const game = await m.read(code);
  if (game == null) return ctx.notFound('No game exists with this code');

  const playerId = await m.join(game.gameId, playerName);

  return ctx.ok({ game, playerId });
});

gamesApi.get('/:code', async (ctx) => {
  const {
    params: { code },
  } = ctx;

  const game = await m.read(code);
  return game ? ctx.ok(game) : ctx.notFound();
});

export default [gamesApi.routes(), gamesApi.allowedMethods()];
