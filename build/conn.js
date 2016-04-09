"use strict";
var debug = require('debug');
var Sequelize = require('sequelize');
var config = require('acm');
exports.__esModule = true;
exports["default"] = function (c) {
    if (c === void 0) { c = config; }
    return new Sequelize(c('database.url'), {
        logging: debug('service:query:exec'),
        pool: c('database.pool')
    });
};
