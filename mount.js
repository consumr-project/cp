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

module.exports = function (req, res, next) {
    req.service = req.service || {};
    req.service.query.model = module.exports.models;
    req.service.query.sequelize = sequelize;
    next();
};

module.exports.models = {
    Company: model('company'),
    Event: model('event'),
    Source: model('source'),
    Tag: model('tag'),
    User: model('user'),
};

module.exports.sequelize = sequelize;

// app.get('/', require('./src/page'));
//
// if (!module.parent) {
//     app.listen(config('port') || 3000);
// }

log('starting sync');
sequelize.sync().then(function () {
    log('sync complete');
});
