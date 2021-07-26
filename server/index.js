/*
 * King Screech's Suits - a homemade card game full of chaos, brought online.
 * Copyright © 2021 Jonathan Ming & Amber Lambie
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
 * details.
 *
 * You should have received a copy of the GNU General Public License along with
 * this program in the LICENSE file. If not, see <https://www.gnu.org/licenses>
 */
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

import BodyParser from 'koa-bodyparser';
import Koa from 'koa';
import Logger from 'koa-logger';
import Respond from 'koa-respond';
import Serve from 'koa-static';
import sslify from 'koa-sslify';

import router from './router.js';
import initWss from './wsHandler.js';

const { default: forceHttps, xForwardedProtoResolver: httpsResolver } = sslify;

const __dirname = dirname(fileURLToPath(import.meta.url));

export default async function main() {
  const app = new Koa();
  if (process.env.NODE_ENV !== 'development') {
    app.use(forceHttps({ resolver: httpsResolver }));
  }

  app.use(Serve(resolve(__dirname, '..', 'build')));
  app.use(Logger());
  app.use(BodyParser());
  app.use(Respond());

  app.use(router.routes());
  app.use(router.allowedMethods());

  const port = process.env.PORT || 5000;
  const server = app.listen(port, () =>
    console.log(`listening on port ${port}`)
  );

  await initWss(server);

  return server;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(`FATAL: ${e?.stack ?? e}`);
    process.exit(1);
  });
}
