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

epilogue.initialize({
    app: app,
    sequelize: conn
});

models = {
    Company: model('company'),
    Event: model('event'),
    Source: model('source'),
    Tag: model('tag'),
    User: model('user'),
};

api = {
    companies: resource(models.Company, true),
    events: resource(models.Event, true),
    sources: resource(models.Source),
    tags: resource(models.Tag),
    users: resource(models.User),
};

log('starting sync');
conn.drop().then(function () {
conn.sync().then(function () {
    log('sync complete');

    if (!module.parent) {
        log('starting server');
        app.listen(config('port') || 3000);
    }
});
});

/**
 * @param {Sequelize.Model} model
 * @param {Boolean} associations
 * @return {epilogue.Resource}
 */
function resource(model, associations) {
    return epilogue.resource({
        model: model,
        associations: associations
    })
}

/**
 * @param {String} name
 * @return {Sequelize.Model}
 */
function model(name) {
    return require('./db/models/' + name)(conn, require('sequelize/lib/data-types'));
}

module.exports = app;
module.exports.api = api;
module.exports.conn = conn;
module.exports.models = models;
