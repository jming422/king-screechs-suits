import pg from 'pg';

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: true },
});

export function replacementsHelper(values) {
  return (v) => `$${values.push(v)}`;
}

export async function txn(fn) {
  const client = pool.connect();
  try {
    await client.query('BEGIN');
    const ret = await fn(client);
    await client.query('COMMIT');
    return ret;
  } catch (e) {
    await client.query('ROLLBACK');
    throw Error.captureStackTrace(e);
  } finally {
    client.release();
  }
}

// Because of how pg promisifies methods, gotta wrap their functions like this:
export const query = (...args) => pool.query(...args);
export const connect = (...args) => pool.connect(...args);
