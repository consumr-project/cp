"use strict";
var debug = require('debug');
var body = require('body-parser');
var express = require('express');
var models_1 = require('./models');
var routes_1 = require('./routes');
var Sequelize = require('sequelize');
var auth, cookie, session;
var config = require('acm'), log = debug('service:query');
var app = express();
module.exports = exports = app;
exports.conn = new Sequelize(config('database.url'), {
    logging: debug('service:query:exec'),
    pool: config('database.pool')
});
exports.models = models_1["default"](exports.conn);
app.use(body.json());
if (!module.parent) {
    auth = require('auth-service');
    cookie = require('cookie-parser');
    session = require('express-session');
    app.use(cookie('session.secret'));
    app.use(session({ secret: 'session.secret' }));
    app.use(auth.passport.initialize());
    app.use(auth.passport.session());
    app.use(auth.as_guest);
    app.use('/auth', auth);
}
routes_1["default"](app, exports.models);
if (!module.parent) {
    app.listen(config('port') || 3000);
}
