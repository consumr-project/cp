import * as express from 'express';
import * as passport from 'passport';
import config = require('acm');

var app = express();

// XXX bit of a hack, but this is the only way that I can reference the local
// copy of `config/rbac.yml`
config.ref.$paths.push(require('path').join(__dirname, '..', 'config'));

// XXX export orders due to import conflict with query-service
module.exports = app;
module.exports.passport = passport;
module.exports.permissions = require('./permissions');

import * as model from './model';
import linkedin_auth from './linkedin';

var linkedin = linkedin_auth();

module.exports.is_logged_in = model.is_logged_in;
module.exports.as_guest = model.as_guest;

if (!module.parent) {
    app.use(passport.initialize());
    app.use(passport.session());
}

passport.serializeUser(model.serialize);
passport.deserializeUser(model.deserialize);
passport.use(linkedin.strategy);

app.get('/user', (req, res) => { res.json(req.user || {}); });
app.get('/logout', (req, res, next) => { req.logout(); next(); }, model.js_update);
app.get('/linkedin', linkedin.pre_base, linkedin.login);
app.get('/linkedin/callback', linkedin.callback, model.js_update);

if (!module.parent) {
    app.listen(config('port') || 3000);
}
