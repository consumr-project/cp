'use strict';

var conn, models, api;

var Sequelize = require('sequelize'),
    DataTypes = require('sequelize/lib/data-types');

var app = require('express')(),
    epilogue = require('epilogue'),
    log = require('debug')('service:query'),
    utils = require('./src/utils'),
    config = require('acm');

conn = new Sequelize(config('database.url'), {
    pool: config('database.pool')
});

models = {
    Company: importer('company'),
    Event: importer('event'),
    Source: importer('source'),
    Tag: importer('tag'),
    User: importer('user'),
}

epilogue.initialize({
    app: app,
    sequelize: conn
});

api = {
    companies: epilogue.resource({
        model: models.Company,
        endpoints: ['/companies', '/companies/:id']
    })
};

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
function importer(name) {
    return require('./db/models/' + name)(conn, require('sequelize/lib/data-types'));
}

module.exports = app;
module.exports.api = api;
module.exports.conn = conn;
module.exports.models = models;
