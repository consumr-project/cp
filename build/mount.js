'use strict';
var conn, models, api;
var Sequelize = require('sequelize'), DataTypes = require('sequelize/lib/data-types');
var body = require('body-parser'), crud = require('./crud'), utils = require('./utils'), debug = require('debug');
var app = require('express')(), config = require('acm'), log = debug('service:query');
conn = new Sequelize(config('database.url'), {
    logging: debug('service:query:exec'),
    pool: config('database.pool')
});
models = require('./models')(conn);
app.use(body.json());
module.exports = app;
module.exports.conn = conn;
module.exports.models = models;
require('./routes')(app, models);
if (!module.parent) {
    log('starting sync');
    conn.sync().then(function () {
        log('sync complete');
        log('starting server');
        app.listen(config('port') || 3000);
    });
}
