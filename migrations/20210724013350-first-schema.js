'use strict';

const defaultMigration = require('./utils/default.js');

exports.setup = defaultMigration.setup;
exports._meta = defaultMigration._meta;

exports.up = function (db) {
  return defaultMigration.up(db, '20210724013350-first-schema-up.sql');
};

exports.down = function (db) {
  return defaultMigration.down(db, '20210724013350-first-schema-down.sql');
};
