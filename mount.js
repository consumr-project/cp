'use strict';

var app = module.exports = require('express')(),
    config = require('acm'),
    passport = require('passport');

var model = require('./src/model'),
    linkedin = require('./src/linkedin')();

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(model.serialize);
passport.deserializeUser(model.deserialize);
passport.use(linkedin.strategy);

app.get('/user', function (req, res) { res.json(req.user || {}); });
app.get('/linkedin', linkedin.pre_base, linkedin.login);
app.get('/linkedin/callback', linkedin.callback);

if (!module.parent) {
    app.listen(config('port') || 3000);
}
