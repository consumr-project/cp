'use strict';

/**
 * rating: g, pg, r, x
 * size: 1 - 2048
 */
const GRAVATAR_AVATAR_URL = 'http://www.gravatar.com/avatar/';
const GRAVATAR_AVATAR_RATING = 'pg';
const GRAVATAR_AVATAR_SIZE = '514';

const User = require('query-service').models.User;

const md5 = require('md5');
const querystring = require('querystring');

/**
 * generates a gravatar url
 * @param {User} user
 * @return {String}
 */
function gravatar_url(user) {
    return GRAVATAR_AVATAR_URL + md5(user.email.trim().toLowerCase()) + '?' +
        querystring.stringify({
            d: user.avatar_url,
            s: GRAVATAR_AVATAR_SIZE,
            r: GRAVATAR_AVATAR_RATING,
        });
}

/**
 * @parma {http.Request} req
 * @parma {http.Response} res
 * @parma {Function} next
 * @return {void}
 */
function http_handler(req, res, next) {
    User.findOne({ where: { email: req.query.email } })
        .then((user) => res.redirect(gravatar_url(user)));
}

module.exports = http_handler;
module.exports.gravatar_url = gravatar_url;
