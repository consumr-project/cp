import { Model } from 'sequelize';
import * as debug from 'debug';
import * as express from 'express';

import gen_conn from './conn';
import gen_models from './models';
import gen_routes from './routes';

var auth, body, cookie, session;

var config = require('acm'),
    log = debug('service:query');

var app = express();
module.exports = exports = app;

log('connecting to %s', config('database.url'));
export var conn = gen_conn();
export var models = gen_models(conn);

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
}

gen_routes(app, models);

if (!module.parent) {
    conn.sync().then(() => {
        app.listen(config('port') || 3000);
        log('ready for database requests');
    });
}
