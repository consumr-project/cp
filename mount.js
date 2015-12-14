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
    EventSource: model('event_source'),
    EventTag: model('event_tag'),
    CompanyFollower: model('company_followers'),
    CompanyEvent: model('company_events'),
    Tag: model('tag'),
    User: model('user'),
};

app.use(body.json());
require('./src/routes')(app, models);

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

if (!module.parent) {
    log('starting sync');
    conn.sync().then(function () {
        log('sync complete');
        log('starting server');
        app.listen(config('port') || 3000);
    });
}
