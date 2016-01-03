'use strict';

var app = require('express')(),
    config = require('acm'),
    passport = require('passport');

var model = require('./src/model'),
    linkedin = require('./src/linkedin')(),
    permissions = require('./src/permissions');

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

module.exports = app;
module.exports.passport = passport;
module.exports.loggedin = model.loggedin;
module.exports.permissions = permissions;
