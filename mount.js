'use strict';

var app = require('express')(),
    config = require('acm'),
    passport = require('passport');

// XXX bit of a hack, but this is the only way that I can reference the local
// copy of `config/rbac.yml`
config.ref.$paths.push(require('path').join(__dirname, 'config'));

module.exports = app;
module.exports.passport = passport;
module.exports.permissions = require('./src/permissions');

var model = require('./src/model'),
    linkedin = require('./src/linkedin')();

module.exports.loggedin = model.loggedin;

if (!module.parent) {
    app.use(passport.initialize());
    app.use(passport.session());
}

passport.serializeUser(model.serialize);
passport.deserializeUser(model.deserialize);
passport.use(linkedin.strategy);

app.get('/user', function (req, res) { res.json(req.user || {}); });
app.get('/logout', function (req, res, next) { req.logout(); next(); }, model.js_update)
app.get('/linkedin', linkedin.pre_base, linkedin.login);
app.get('/linkedin/callback', linkedin.callback, model.js_update);

if (!module.parent) {
    app.listen(config('port') || 3000);
}
