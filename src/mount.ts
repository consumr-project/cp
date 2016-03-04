import { Model } from 'sequelize';
import * as debug from 'debug';
import * as body from 'body-parser';
import * as express from 'express';

import gen_models from './models';
import gen_routes from './routes';

import Sequelize = require('sequelize');

var auth, cookie, session;

var config = require('acm'),
    log = debug('service:query');

var app = express();
module.exports = exports = app;

export var conn = new Sequelize(config('database.url'), {
    logging: debug('service:query:exec'),
    pool: config('database.pool')
});

export var models = gen_models(conn);

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

gen_routes(app, models);

if (!module.parent) {
    app.listen(config('port') || 3000);
}
