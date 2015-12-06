'use strict';

var conn, models, api;

var Sequelize = require('sequelize'),
    DataTypes = require('sequelize/lib/data-types');

var app = require('express')(),
    log = require('debug')('service:query'),
    body = require('body-parser'),
    crud = require('./src/crud'),
    utils = require('./src/utils'),
    config = require('acm');

conn = new Sequelize(config('database.url'), {
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
