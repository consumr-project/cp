import * as debug from 'debug';
import * as express from 'express';
import * as passport from 'passport';
import config = require('acm');

var app = express(),
    log = debug('service:auth');

// XXX bit of a hack, but this is the only way that I can reference the local
// copy of `config/rbac.yml`
config.ref.$paths.push(require('path').join(__dirname, '..', 'config'));

// XXX export orders due to import conflict with query-service
module.exports = app;
module.exports.passport = passport;
module.exports.permissions = require('./permissions');

import * as model from './model';
import linkedin_auth from './linkedin';
import apikey_auth from './apikey';

var linkedin = linkedin_auth();
var apikey = apikey_auth();

let user = (req, res) => { res.json(req.user || {}); };

module.exports.is_logged_in = model.is_logged_in;
module.exports.as_guest = model.as_guest;

if (!module.parent) {
    app.use(require('body-parser').json());
    app.use(require('cookie-parser')('session.secret'));
    app.use(require('express-session')({ secret: 'session.secret' }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(model.as_guest);

    require('query-service').conn.sync().then(() => {
        app.listen(config('port') || 3000);
        log('ready for database requests');
    });
}

passport.serializeUser(model.serialize);
passport.deserializeUser(model.deserialize);
passport.use(linkedin.strategy);
passport.use(apikey.strategy);

app.get('/user', user);
app.get('/logout', (req, res, next) => { req.logout(); next(); }, model.js_update);
app.get('/linkedin', linkedin.pre_base, linkedin.login);
app.get('/linkedin/callback', linkedin.callback, model.js_update);

if (process.env.DEBUG && process.env.CP_ALLOW_APIKEY_AUTH) {
    app.post('/key', apikey.login, user);
}
