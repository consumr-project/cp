'use strict';

var Sequelize = require('sequelize'),
    DataTypes = require('sequelize/lib/data-types');

var app = require('express')(),
    log = require('debug')('service:query'),
    utils = require('./src/utils'),
    config = require('acm');

var sequelize = new Sequelize(config('database.url'), {
    pool: config('database.pool')
});

var model = utils.importer(sequelize, DataTypes, require);

var models = {
    Event: model('event'),
    Source: model('source'),
    Tag: model('tag'),
};

log('starting sync');
sequelize.drop().then(function () {
    log('sync complete');
    sequelize.sync().then(function () {
        log('sync complete');
    });
});

module.exports = app;
// app.get('/', require('./src/page'));
//
// if (!module.parent) {
//     app.listen(config('port') || 3000);
// }
