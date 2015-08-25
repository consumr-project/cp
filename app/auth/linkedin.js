'use strict';

var FirebaseToken = require('firebase-token-generator'),
    LinkedInStrategy = require('passport-linkedin').Strategy,
    passport = require('passport');

/**
 * @param {express} app
 * @param {acm} config
 * @param {Firebase} firebase
 */
module.exports = function (app, config, firebase) {
    var token, linkedin;

    var auth_callback_url = config.get('session.auth.callback_url'),
        auth_cookie = config.get('session.auth.cookie'),
        firebase_secret = config.get('firebase.secret'),
        linkedin_client_id = config.get('linkedin.client_id'),
        linkedin_client_secret = config.get('linkedin.client_secret');

    token = new FirebaseToken(firebase_secret);

    linkedin = new LinkedInStrategy({
        consumerKey: linkedin_client_id,
        consumerSecret: linkedin_client_secret,
        callbackURL: auth_callback_url
    }, loginHandler);

    /**
     * @param {String} access
     * @param {String} refresh
     * @param {Object} profile
     * @param {Function} done
     */
    function loginHandler(access, refresh, profile, done) {
        return done(null, {
            accessToken: access || '',
            displayName: profile.name,
            id: profile.id,
            provider: profile.provider,
            refreshToken: refresh || '',
            thirdPartyUserData: profile._json,
            uid: profile.provider + ':' + profile.id
        });
    }

    /**
     * @param {http.Request} req
     * @param {http.Response} res
     * @param {Function} next
     */
    function linkedinLogin(req, res, next) {
        res.cookie(auth_cookie, req.query.oAuthTokenPath, { signed: true });
        passport.authenticate('linkedin', { state: '_____' })(req, res, next);
    }

    /**
     * @param {http.Request} req
     * @param {http.Response} res
     * @param {Function} next
     */
    function linkedinCallback(req, res, next) {
        passport.authenticate('linkedin', function (err, user, info) {
            firebase.auth(firebase_secret, function (err, data) {
                var tok;

                firebase.child('oAuthToken')
                    .child(user.uid)
                    .set(user.accessToken);

                if (user) {
                    tok = token.createToken(user);
                }

                firebase.child(req.signedCookies[auth_cookie])
                    .set(tok);

                // res.send('done');
            });
        })(req, res, next);
    }

    passport.use(linkedin);
    app.get('/auth/linkedin', linkedinLogin);
    app.get('/auth/linkedin/callback', linkedinCallback);
};
