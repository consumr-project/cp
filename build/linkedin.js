'use strict';
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy, User = require('query-service').models.User, roles = require('./permissions').roles;
var passport = require('passport'), config = require('acm'), getset = require('deep-get-set'), uuid = require('node-uuid'), url = require('url');
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
function generate_where(profile) {
    return {
        auth_linkedin_id: profile.id
    };
}
function generate_user(profile) {
    var id = uuid.v4();
    return {
        id: id,
        role: roles.USER,
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
        updated_date: Date.now()
    };
}
function find_user(token, tokenSecret, profile, done) {
    return User.findOrCreate({
        where: generate_where(profile),
        defaults: generate_user(profile)
    })
        .spread(done.bind(null, null))
        .catch(done);
}
function set_callback_url(strategy, req, res, next) {
    strategy._callbackURL = get_callback_url(req);
    return next(null);
}
function get_callback_url(req) {
    var parts = url.parse(req.originalUrl);
    return req.protocol + '://' + req.get('host') + parts.pathname + '/callback';
}
module.exports = function () {
    var configuration = {
        clientID: config('linkedin.client_id'),
        clientSecret: config('linkedin.client_secret'),
        profileFields: profile_fields,
        scope: ['r_basicprofile', 'r_emailaddress'],
        callbackURL: ''
    };
    var login = passport.authenticate('linkedin', { state: '____' }), callback = passport.authenticate('linkedin', { failureRedirect: '/error?with=linkedin-login' }), strategy = new LinkedInStrategy(configuration, find_user);
    return {
        pre_base: set_callback_url.bind(null, strategy),
        login: login,
        callback: callback,
        strategy: strategy
    };
};
