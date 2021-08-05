import { WebSocketServer } from 'ws';

import * as gl from './gamelogic.js';
import * as players from './models/players.js';

let wss;

export default async function initWsServer(httpServer) {
  if (wss)
    throw new Error(`Can't init a WS server when one is already running!`);

  wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', async (ws, req) => {
    console.debug('websocket connect');

    const q = new URLSearchParams(req.url.slice(req.url.indexOf('?')));
    const playerId = parseInt(q.get('playerId')?.trim());
    const gameId = await players.getPlayerGame(playerId);

    if (isNaN(playerId) || gameId == null) {
      console.warn(
        `WS connection route didn't include valid in-game playerId, disconnecting it`
      );
      ws.terminate();
      return;
    }
    ws.playerId = playerId;
    ws.gameId = gameId;

    ws.isAlive = true;
    ws.on('pong', () => {
      ws.isAlive = true;
    });

    ws.on('close', () => console.debug('websocket disconnect'));

    ws.on('message', (data, isBinary) => handleMessage(ws, data, isBinary));
  });

  const serverHeartbeat = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) {
        ws.terminate();
        return;
      }
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  wss.on('close', () => clearInterval(serverHeartbeat));
}

export async function handleMessage(ws, msg, isBinary) {
  if (isBinary) {
    console.warn(
      'Binary WS message received; this is not supported, dropping it'
    );
    return;
  }

  let jsonMsg;
  try {
    jsonMsg = JSON.parse(msg);
  } catch (_e) {
    console.warn('Invalid JSON message received; dropping it');
  }

  const { playerId, gameId } = ws;
  const { event, payload } = jsonMsg;

  let fn;
  switch (event) {
    case 'ability':
      fn = gl.resolveAbility;
      break;
    case 'draw':
      fn = gl.resolveDraw;
      break;
    case 'match':
      fn = gl.resolveMatch;
      break;
    case 'discard':
      fn = gl.resolveDiscard;
      break;
    default:
      console.warn(`Invalid event type ${event}, dropping it`);
      break;
  }

  if (fn) {
    const resp = await fn(gameId, playerId, payload);
    ws.send(JSON.stringify({ event: 'response', success: !!resp }));
    if (resp) {
      wss.clients.forEach((c) =>
        c.send(JSON.stringify({ event: 'gameStateUpdated' }))
      );
    }
  }
}
