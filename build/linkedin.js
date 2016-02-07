"use strict";
var permissions_1 = require('./permissions');
var lodash_1 = require('lodash');
var url_1 = require('url');
var query_service_1 = require('query-service');
var passport = require('passport');
var config = require('acm');
var QueryService = require('query-service');
var PassportLinkedInOauth2 = require('passport-linkedin-oauth2');
var User = QueryService.models.User;
var LinkedInStrategy = PassportLinkedInOauth2.Strategy;
var SCOPE = [
    'r_basicprofile',
    'r_emailaddress',
];
var PROFILE_FIELDS = [
    'id',
    'first-name',
    'last-name',
    'email-address',
    'headline',
    'summary',
    'positions',
    'picture-url',
    'public-profile-url',
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
        role: permissions_1.roles.USER,
        auth_linkedin_id: profile.id,
        avatar_url: profile._json.pictureUrl,
        company_name: lodash_1.get(profile._json, 'positions.values.0.company.name'),
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
    return query_service_1.User.findOrCreate({
        where: generate_where(profile),
        defaults: generate_user(profile)
    })
        .spread(done.bind(null, null))
        .catch(done);
}
function set_callback_url(strategy, req, res, next) {
    strategy._callbackURL = get_callback_url(req);
    next(null);
}
function get_callback_url(req) {
    var parts = url_1.parse(req.originalUrl);
    return req.protocol + '://' + req.get('host') + parts.pathname + '/callback';
}
function default_1() {
    var configuration = {
        clientID: config('linkedin.client_id'),
        clientSecret: config('linkedin.client_secret'),
        profileFields: PROFILE_FIELDS,
        scope: SCOPE,
        callbackURL: ''
    };
    var login = passport.authenticate('linkedin', { state: '____' }), callback = passport.authenticate('linkedin', { failureRedirect: '/error?with=linkedin-login' }), strategy = new LinkedInStrategy(configuration, find_user), pre_base = set_callback_url.bind(null, strategy);
    return { login: login, strategy: strategy, callback: callback, pre_base: pre_base };
}
exports.__esModule = true;
exports["default"] = default_1;
