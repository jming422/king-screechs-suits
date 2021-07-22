import Router from 'koa-router';

import * as m from '../models/games.js';

const gamesApi = new Router();

gamesApi.post('/', async (ctx) => {
  console.log('starting new game');
  return ctx.ok(await m.create());
});

gamesApi.post('/join/:code', async (ctx) => {
  const {
    params: { code },
  } = ctx;

  console.log(`request to join game ${code}`);

  return ctx.notImplemented();
});

gamesApi.get('/:code', async (ctx) => {
  const {
    params: { code },
  } = ctx;

  console.log(`get game ${code}`);

  const game = await m.read(code);

  return game ? ctx.ok(game) : ctx.notFound();
});

export default [gamesApi.routes(), gamesApi.allowedMethods()];
