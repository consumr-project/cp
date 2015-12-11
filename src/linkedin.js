'use strict';

var LinkedInStrategy = require('passport-linkedin').Strategy,
    User = require('query-service').models.User;

var passport = require('passport'),
    config = require('acm'),
    getset = require('deep-get-set'),
    uuid = require('node-uuid'),
    url = require('url');

var profile_fields = [
    'id',
    'first-name',
    'last-name',
    'email-address',
    'headline',
    'summary',
    'positions',
    'picture-url',
    'public-profile-url'
];

/**
 * @param {Object} linkedin profile
 * @return {Where}
 */
function generate_where(profile) {
    return {
        auth_linkedin_id: profile.id
    };
}

/**
 * @param {Object} linkedin profile
 * @return {User}
 */
function generate_user(profile) {
    var id = uuid.v4();

    return {
        id: id,
        auth_linkedin_id: profile.id,
        avatar_url: profile._json.pictureUrl,
        company_name: getset(profile._json, 'positions.values.0.company.name'),
        created_by: id,
        created_date: Date.now(),
        email: profile._json.emailAddress,
        lang: 'en',
        last_login_date: Date.now(),
        linkedin_url: profile._json.publicProfileUrl,
        name: profile.displayName,
        summary: profile._json.summary,
        title: profile._json.headline,
        updated_by: id,
        updated_date: Date.now(),
    };
}

/**
 * @param {String} token
 * @param {String} tokenSecret
 * @param {Object} profile
 * @param {Function} done
 * @return {Promise}
 */
function find_user(token, tokenSecret, profile, done) {
    return User.findOrCreate({
        where: generate_where(profile),
        defaults: generate_user(profile)
    })
        .spread(done.bind(null, null))
        .catch(done);
}

/**
 * @param {passport.Strategy} strategy
 * @param {http.Request} req
 * @param {http.Response} res
 * @param {Function} next
 */
function set_callback_url(strategy, req, res, next) {
    strategy._callbackURL = get_callback_url(req);
    return next(null);
}

/**
 * @param {http.Request}
 * @return {String}
 */
function get_callback_url(req) {
    var parts = url.parse(req.originalUrl);
    return req.protocol + '://' + req.get('host') + parts.pathname + '/callback';
}

module.exports = function () {
    var configuration = {
        consumerKey: config('linkedin.client_id'),
        consumerSecret: config('linkedin.client_secret'),
        profileFields: profile_fields,
        callbackURL: '',
    };

    var login = passport.authenticate('linkedin'),
        callback = passport.authenticate('linkedin', { failureRedirect: '/error?with=linkedin-login' }),
        strategy = new LinkedInStrategy(configuration, find_user);

    return {
        pre_base: set_callback_url.bind(null, strategy),
        login: login,
        callback: callback,
        strategy: strategy
    };
};
