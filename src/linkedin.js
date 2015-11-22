'use strict';

var Firebase = require('firebase'),
    FirebaseToken = require('firebase-token-generator'),
    LinkedInStrategy = require('passport-linkedin').Strategy;

var config = require('acm'),
    passport = require('passport'),
    url = require('url'),
    getset = require('deep-get-set'),
    md5 = require('md5');

var firebase_secret = config('firebase.secret'),
    session_cookie = config('session.cookie');

/**
 * @param {http.Request}
 * @return {String}
 */
function getCallbackUrl(req) {
    var parts = url.parse(req.originalUrl);
    return req.protocol + '://' + req.get('host') + parts.pathname + '/callback';
}

/**
 * get the value of a property from the first object that has it
 * @param {String} prop
 * @param {Object[]} objs
 * @return {*}
 */
function getFrom(prop, objs) {
    for (var i = 0, len = objs.length; i < len; i++) {
        if (objs[i] && objs[i][prop] !== null && objs[i][prop] !== undefined) {
            return objs[i][prop];
        }
    }

    return '';
}

/**
 * @param {Object} user_data raw user information from login provider
 * @return {Function} see docs below
 * @param {Object} user_ref object we're sending back to firebase
 * @return {Object} populated user_ref
 */
function populateUser(user_data) {
    return function (user_ref) {
        if (!user_ref) {
            user_ref = {};
        }

        user_ref.avatarUrl = getFrom('avatarUrl', [user_ref, user_data]);
        user_ref.companyName = getFrom('companyName', [user_ref, user_data]);
        user_ref.dateCreated = user_ref.dateCreated || Date.now();
        user_ref.dateLastLogin = Date.now();
        user_ref.dateModified = user_ref.dateCreated || Date.now();
        user_ref.email = getFrom('email', [user_ref, user_data]);
        user_ref.fullName = getFrom('fullName', [user_ref, user_data]);
        user_ref.guid = getFrom('guid', [user_ref, user_data]);
        user_ref.lang = 'en';
        user_ref.linkedinId = getFrom('linkedinId', [user_ref, user_data]);
        user_ref.linkedinUrl = getFrom('linkedinUrl', [user_ref, user_data]);
        user_ref.loginProvider = getFrom('loginProvider', [user_ref, user_data]);
        user_ref.summary = getFrom('summary', [user_ref, user_data]);
        user_ref.title = getFrom('title', [user_ref, user_data]);

        return user_ref;
    };
}

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

module.exports = function () {
    var firebase = new Firebase(config('firebase.url')),
        token = new FirebaseToken(firebase_secret);

    /**
     * NOTE callbackURL is set on the first request/call to `linkedinLogin`
     * since we don't know where these endpoints were mounted to
     */
    var linkedin = new LinkedInStrategy({
        consumerKey: config('linkedin.client_id'),
        consumerSecret: config('linkedin.client_secret'),
        callbackURL: '',
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
     * @param {http.Request} req
     * @param {http.Response} res
     * @param {Function} next
     */
    function linkedinCallback(req, res, next) {
        passport.authenticate('linkedin', function (err, user_data) {
            firebase.auth(firebase_secret, function () {
                var tok;

                firebase.child('oAuthToken')
                    .child(user_data.guid)
                    .set(user_data.accessToken);

                if (user_data) {
                    tok = token.createToken({ uid: user_data.uid });
                }

                firebase.child(req.signedCookies[session_cookie])
                    .set(tok);

                firebase.child('user')
                    .child(user_data.guid)
                    .transaction(populateUser(user_data));
            });
        })(req, res, next);
    }

    /**
     * @param {http.Request} req
     * @param {http.Response} res
     * @param {Function} next
     */
    function linkedinLogin(req, res, next) {
        linkedin._callbackURL = getCallbackUrl(req);
        res.cookie(session_cookie, req.query.oAuthTokenPath, { signed: true });
        passport.authenticate('linkedin', { state: '_____' })(req, res, next);
    }

    return {
        strategy: linkedin,
        login: linkedinLogin,
        callback: linkedinCallback
    };
};
