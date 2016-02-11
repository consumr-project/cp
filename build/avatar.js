"use strict";
var QueryService = require('query-service');
var querystring = require('querystring');
var md5 = require('md5');
var GRAVATAR_URL = 'http://www.gravatar.com/avatar/';
var User = QueryService.models.User;
(function (RATING) {
    RATING[RATING["G"] = 'g'] = "G";
    RATING[RATING["PG"] = 'pg'] = "PG";
    RATING[RATING["R"] = 'r'] = "R";
    RATING[RATING["X"] = 'x'] = "X";
})(exports.RATING || (exports.RATING = {}));
var RATING = exports.RATING;
(function (SIZE) {
    SIZE[SIZE["AVATAR"] = 512] = "AVATAR";
    SIZE[SIZE["MEDIUM"] = 1024] = "MEDIUM";
    SIZE[SIZE["LARGE"] = 1536] = "LARGE";
    SIZE[SIZE["FULL"] = 2048] = "FULL";
})(exports.SIZE || (exports.SIZE = {}));
var SIZE = exports.SIZE;
function generate_gravatar_url(req, user) {
    var fallback = user ? user.avatar_url : '';
    var email = (user ? user.email : req.query.email)
        .toLowerCase()
        .trim();
    return GRAVATAR_URL + md5(email) + '?' +
        querystring.stringify({
            d: fallback,
            s: req.query.size || SIZE.AVATAR,
            r: req.query.rating || RATING.G
        });
}
function http_handler(req, res, next) {
    User.findOne({ where: { email: req.query.email } })
        .then(function (user) { return res.redirect(generate_gravatar_url(req, user)); });
}
exports.__esModule = true;
exports["default"] = http_handler;
