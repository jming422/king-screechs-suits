'use strict';

const defaultMigration = require('./utils/default.js');

exports.setup = defaultMigration.setup;
exports._meta = defaultMigration._meta;

exports.up = function (db) {
  return defaultMigration.up(db, '20210720065459-init-up.sql');
};

exports.down = function (db) {
  return defaultMigration.down(db, '20210720065459-init-down.sql');
};
