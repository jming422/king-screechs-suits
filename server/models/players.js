import * as db from '../db.js';

export async function getPlayerGame(playerId) {
  const { rows } = await db.query(
    `SELECT g.game_id
     FROM games AS g
     NATURAL JOIN game_players AS gp
     WHERE gp.player_id = $1`,
    [playerId]
  );

  return rows[0]?.game_id ?? null;
}
