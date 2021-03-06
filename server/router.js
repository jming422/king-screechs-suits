import Router from 'koa-router';
import send from 'koa-send';

import games from './routes/games.js';

// Index router
const router = new Router();

// API routes
const api = new Router();
api
  .prefix('/api/v1')
  .get('/ping', (ctx) => ctx.ok('pong'))
  .use('/game', ...games);

// Frontend-serving routes
const frontend = new Router();

async function serveIndexHtml(ctx) {
  ctx.response.status = 200;
  return await send(ctx, 'build/index.html');
}

frontend.get('(.*)', serveIndexHtml);

// API routes are more specific and should come first. Frontend router is a
// catchall and should come last.
router.use(api.routes(), api.allowedMethods());
router.use(frontend.routes(), frontend.allowedMethods());

export default router;
