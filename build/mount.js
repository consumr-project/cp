"use strict";
var debug = require('debug');
var body = require('body-parser');
var express = require('express');
var models_1 = require('./models');
var routes_1 = require('./routes');
var Sequelize = require('sequelize');
var config = require('acm'), log = debug('service:query');
var app = express();
module.exports = exports = app;
exports.conn = new Sequelize(config('database.url'), {
    logging: debug('service:query:exec'),
    pool: config('database.pool')
});
exports.models = models_1["default"](exports.conn);
app.use(body.json());
routes_1["default"](app, exports.models);
