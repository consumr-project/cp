"use strict";
var express = require('express');
var passport = require('passport');
var config = require('acm');
var app = express();
config.ref.$paths.push(require('path').join(__dirname, '..', 'config'));
module.exports = app;
module.exports.passport = passport;
module.exports.permissions = require('./permissions');
var model = require('./model');
var linkedin_1 = require('./linkedin');
var linkedin = linkedin_1["default"]();
module.exports.is_logged_in = model.is_logged_in;
module.exports.as_guest = model.as_guest;
if (!module.parent) {
    app.use(passport.initialize());
    app.use(passport.session());
}
passport.serializeUser(model.serialize);
passport.deserializeUser(model.deserialize);
passport.use(linkedin.strategy);
app.get('/user', function (req, res) { res.json(req.user || {}); });
app.get('/logout', function (req, res, next) { req.logout(); next(); }, model.js_update);
app.get('/linkedin', linkedin.pre_base, linkedin.login);
app.get('/linkedin/callback', linkedin.callback, model.js_update);
if (!module.parent) {
    app.listen(config('port') || 3000);
}
