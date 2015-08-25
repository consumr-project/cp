'use strict';

var passport = require('passport');

/**
 * @param {express} app
 */
module.exports = function (app) {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function (user, done) {
        done(null, user.guid);
    });

    passport.deserializeUser(function (user, done) {
        done(null, { guid: user.guid });
    });
};
