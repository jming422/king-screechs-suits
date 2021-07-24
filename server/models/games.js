import _ from 'lodash';
import camelcase from 'camelcase';
import camelcaseKeys from 'camelcase-keys';

import * as db from '../db.js';

/** All columns */
// const COLS = ['game_id', 'code', 'state'];

/** Editable columns */
const ECOLS = ['state'];

export async function create() {
  const { rows } = await db.query(
    'INSERT INTO games DEFAULT VALUES RETURNING *'
  );

  return camelcaseKeys(rows[0]);
}

export async function read(code) {
  const { rows } = await db.query('SELECT * FROM games WHERE code = $1', [
    code,
  ]);
  return rows[0] ? camelcaseKeys(rows[0]) : null;
}

export async function update(code, updates) {
  const values = [];
  const r = db.replacementsHelper(values);

  const ups = _(ECOLS)
    .map((sc) => {
      const up = updates[camelcase(sc)];
      return up !== undefined && `${sc} = ${r(up)}`;
    })
    .compact()
    .join();

  if (!ups) return 0;

  const { rowCount } = await db.query(
    `UPDATE games SET ${ups} WHERE code = ${r(code)}`,
    values
  );

  return rowCount;
}

export async function del(code) {
  const { rowCount } = await db.query('DELETE FROM games WHERE code = $1', [
    code,
  ]);
  return rowCount;
}
