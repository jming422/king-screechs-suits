import Router from 'koa-router';
import send from 'koa-send';

// Index router
const router = new Router();

// API routes
const api = new Router();
api.prefix('/api/v1').get('/ping', (ctx) => ctx.ok('pong'));

// Frontend-serving routes
const frontend = new Router();

async function serveIndexHtml(ctx) {
  ctx.response.status = 200;
  return await send(ctx, 'build/index.html');
}

// const paths = ['/'];
// frontend.get(paths, serveIndexHtml);
frontend.get('(.*)', serveIndexHtml);

// API routes are more specific and should come first. Frontend routes include a
// catchall and should come last.
router.use(api.routes(), api.allowedMethods());
router.use(frontend.routes(), frontend.allowedMethods());

export default router;
