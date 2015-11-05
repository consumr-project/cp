'use strict';

var FirebaseToken = require('firebase-token-generator'),
    LinkedInStrategy = require('passport-linkedin').Strategy,
    passport = require('passport'),
    getset = require('deep-get-set'),
    md5 = require('md5');

/**
 * @param {express} app
 * @param {acm} config
 * @param {Firebase} firebase
 */
module.exports = function (app, config, firebase) {
    var token, linkedin;

    var firebase_secret = config('firebase.secret'),
        linkedin_client_id = config('linkedin.client_id'),
        linkedin_client_secret = config('linkedin.client_secret'),
        session_cookie = config('session.cookie'),
        session_domain = config('session.domain');

    token = new FirebaseToken(firebase_secret);

    linkedin = new LinkedInStrategy({
        consumerKey: linkedin_client_id,
        consumerSecret: linkedin_client_secret,
        callbackURL: session_domain + 'auth/linkedin/callback',
        profileFields: [
            'id',
            'first-name',
            'last-name',
            'email-address',
            'headline',
            'summary',
            'positions',
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
            companyName: getset(profile._json, 'positions.values.0.company.name'),
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
        res.cookie(session_cookie, req.query.oAuthTokenPath, { signed: true });
        passport.authenticate('linkedin', { state: '_____' })(req, res, next);
    }

    /**
     * @param {http.Request} req
     * @param {http.Response} res
     * @param {Function} next
     */
    function linkedinCallback(req, res, next) {
        passport.authenticate('linkedin', function (err, user) {
            firebase.auth(firebase_secret, function () {
                var tok, ref;

                firebase.child('oAuthToken')
                    .child(user.guid)
                    .set(user.accessToken);

                if (user) {
                    tok = token.createToken({ uid: user.uid });
                }

                firebase.child(req.signedCookies[session_cookie])
                    .set(tok);

                ref = firebase.child('user')
                    .child(user.guid);

                ref.child('avatarUrl').set(user.avatarUrl);
                ref.child('email').set(user.email);
                ref.child('fullName').set(user.fullName);
                ref.child('companyName').set(user.companyName);
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
