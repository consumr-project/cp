"use strict";
var debug = require('debug');
var express = require('express');
var conn_1 = require('./conn');
var models_1 = require('./models');
var routes_1 = require('./routes');
var auth, body, cookie, session;
var config = require('acm'), log = debug('service:query');
var app = express();
module.exports = exports = app;
log('connecting to %s', config('database.url'));
exports.conn = conn_1["default"]();
exports.models = models_1["default"](exports.conn);
if (!module.parent) {
    auth = require('auth-service');
    body = require('body-parser');
    cookie = require('cookie-parser');
    session = require('express-session');
    app.use(body.json());
    app.use(cookie('session.secret'));
    app.use(session({ secret: 'session.secret' }));
    app.use(auth.passport.initialize());
    app.use(auth.passport.session());
    app.use(auth.as_guest);
    app.use('/auth', auth);
    exports.conn.sync().then(function () {
        app.listen(config('port') || 3000);
        log('ready for database requests');
    });
}
routes_1["default"](app, exports.models, exports.conn);
