'use strict';

var Sequelize = require('sequelize'),
    DataTypes = require('sequelize/lib/data-types');

var app = require('express')(),
    log = require('debug')('service:query'),
    utils = require('./src/utils'),
    config = require('acm');

var sequelize = new Sequelize(config('database.name'), config('database.username'), config('database.password'), {
    host: config('database.connection.host'),
    dialect: config('database.connection.dialect'),
    pool: config('database.connection.pool')
});

var model = utils.importer(sequelize, DataTypes, require);

// var models = {
//     Event: model('event'),
//     Tag: model('tag'),
// };

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
