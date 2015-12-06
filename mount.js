'use strict';

var conn, models, api;

var Sequelize = require('sequelize'),
    DataTypes = require('sequelize/lib/data-types');

var body = require('body-parser'),
    crud = require('./src/crud'),
    utils = require('./src/utils'),
    debug = require('debug');

var app = require('express')(),
    config = require('acm'),
    log = debug('service:query');

conn = new Sequelize(config('database.url'), {
    logging: debug('service:query:exec'),
    pool: config('database.pool')
});

models = {
    Company: model('company'),
    Event: model('event'),
    Source: model('source'),
    Tag: model('tag'),
    User: model('user'),
};

app.use(body.json());
app.get('/companies/:id?', crud.retrieve(models.Company));
app.post('/companies', crud.create(models.Company));

log('starting sync');
conn.sync().then(function () {
    log('sync complete');

    if (!module.parent) {
        log('starting server');
        app.listen(config('port') || 3000);
    }
});

/**
 * @param {String} name
 * @return {Sequelize.Model}
 */
function model(name) {
    return require('./db/models/' + name)(conn, require('sequelize/lib/data-types'));
}

module.exports = app;
module.exports.conn = conn;
module.exports.models = models;
