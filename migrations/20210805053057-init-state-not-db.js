'use strict';

const defaultMigration = require('./utils/default.js');

exports.setup = defaultMigration.setup;
exports._meta = defaultMigration._meta;

exports.up = function (db) {
  return defaultMigration.up(db, '20210805053057-init-state-not-db-up.sql');
};

exports.down = function (_db) {};
