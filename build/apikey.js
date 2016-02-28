'use strict';
var passport = require('passport');
var LocalApiKey = require('passport-localapikey');
var QueryService = require('query-service');
var ApiKey = LocalApiKey.Strategy;
var UserModel = QueryService.models.User;
function find_user(apikey, done) {
    UserModel.findOne({
        where: {
            auth_apikey: apikey
        }
    })
        .then(function (user) { return done(null, user); })
        .catch(done);
}
function default_1() {
    var login = passport.authenticate('localapikey'), strategy = new ApiKey(find_user);
    return { login: login, strategy: strategy };
}
exports.__esModule = true;
exports["default"] = default_1;
