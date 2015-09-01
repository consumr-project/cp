'use strict';

var FirebaseToken = require('firebase-token-generator'),
    LinkedInStrategy = require('passport-linkedin').Strategy,
    passport = require('passport'),
    md5 = require('md5');

/**
 * @param {express} app
 * @param {acm} config
 * @param {Firebase} firebase
 */
module.exports = function (app, config, firebase) {
    var token, linkedin;

    var auth_callback_url = config.get('session.auth.callback_url'),
        auth_cookie = config.get('session.cookie'),
        firebase_secret = config.get('firebase.secret'),
        linkedin_client_id = config.get('linkedin.client_id'),
        linkedin_client_secret = config.get('linkedin.client_secret');

    token = new FirebaseToken(firebase_secret);

    linkedin = new LinkedInStrategy({
        consumerKey: linkedin_client_id,
        consumerSecret: linkedin_client_secret,
        callbackURL: auth_callback_url,
        profileFields: [
            'id',
            'first-name',
            'last-name',
            'email-address',
            'headline',
            'summary',
            'picture-url',
            'public-profile-url'
        ]
    }, loginHandler);

    /**
     * @param {String} access
     * @param {String} refresh
     * @param {Object} profile
     * @param {Function} done
     */
    function loginHandler(access, refresh, profile, done) {
        var guid = md5(profile.provider + profile.id);

        return done(null, {
            accessToken: access,
            avatarUrl: profile._json.pictureUrl,
            email: profile._json.emailAddress,
            fullName: profile.displayName,
            guid: guid,
            linkedinId: profile.id,
            linkedinUrl: profile._json.publicProfileUrl,
            loginProvider: profile.provider,
            refreshToken: refresh,
            summary: profile._json.summary,
            title: profile._json.headline,
            uid: guid
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
                var tok, ref;

                firebase.child('oAuthToken')
                    .child(user.guid)
                    .set(user.accessToken);

                if (user) {
                    tok = token.createToken({ uid: user.uid });
                }

                firebase.child(req.signedCookies[auth_cookie])
                    .set(tok);

                ref = firebase.child('user')
                    .child(user.guid);

                ref.child('avatarUrl').set(user.avatarUrl);
                ref.child('email').set(user.email);
                ref.child('fullName').set(user.fullName);
                ref.child('guid').set(user.guid);
                ref.child('linkedinId').set(user.linkedinId);
                ref.child('linkedinUrl').set(user.linkedinUrl);
                ref.child('loginProvider').set(user.loginProvider);
                ref.child('summary').set(user.summary);
                ref.child('title').set(user.title);
            });
        })(req, res, next);
    }

    passport.use(linkedin);
    app.get('/auth/linkedin', linkedinLogin);
    app.get('/auth/linkedin/callback', linkedinCallback);
};
