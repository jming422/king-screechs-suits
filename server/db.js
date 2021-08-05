import pg from 'pg';

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === 'development'
      ? undefined
      : { rejectUnauthorized: true },
});

export function replacementsHelper(values) {
  return (v) => `$${values.push(v)}`;
}

const ISOLATION_LEVELS = new Set([
  'READ COMMITTED',
  'REPEATABLE READ',
  'SERIALIZABLE',
]);
const MAX_TXN_ATTEMPTS = 5;

export async function txn(fn, isolationLevel) {
  if (isolationLevel && !ISOLATION_LEVELS.has(isolationLevel))
    throw new Error(`Invalid transaction isolation level ${isolationLevel}`);

  const client = pool.connect();

  const retryable = isolationLevel && isolationLevel !== 'READ COMMITTED';
  for (let i = 0; i < retryable ? MAX_TXN_ATTEMPTS : 1; i++) {
    try {
      await client.query(
        `BEGIN${
          isolationLevel ? ` TRANSACTION ISOLATION LEVEL ${isolationLevel}` : ''
        }`
      );
      const ret = await fn(client);
      await client.query('COMMIT');
      client.release();
      return ret;
    } catch (e) {
      await client.query('ROLLBACK');

      const serializationError = e?.message?.includes(
        'could not serialize access'
      );

      // Not retryable
      if (!serializationError || !retryable || i + 1 >= MAX_TXN_ATTEMPTS) {
        client.release();
        throw Error.captureStackTrace(e);
      }

      // Else, retryable
      const delay = 1000 * Math.random() * 2 ** i;
      console.warn(
        `[db] Transaction serialization failure; retrying after ${delay}ms`
      );
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  throw new Error(
    `This transaction wasn't executed successfully, likely because of a bug in db.js`
  );
}

// Because of how pg promisifies methods, gotta wrap their functions like this:
export const query = (...args) => pool.query(...args);
export const connect = (...args) => pool.connect(...args);
