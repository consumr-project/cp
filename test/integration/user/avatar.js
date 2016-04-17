'use strict';

const tape = require('tape');
const http = require('../utils/http');
const config = require('acm');

tape('avatar', t => {
    t.plan(6);

    http.get('/service/user/avatar?email=test@test.com')
        .redirects(1)
        .end(redirects(t, 'goes gravatar test url', gravatar_url(512, 'g')));

    http.get('/service/user/avatar?email=test@test.com&size=1024')
        .redirects(1)
        .end(redirects(t, 'specify size', gravatar_url(1024, 'g')));

    http.get('/service/user/avatar?email=test@test.com&rating=pg')
        .redirects(1)
        .end(redirects(t, 'specify rating', gravatar_url(512, 'pg')));
});

/**
 * @param {Tape} t
 * @param {String} label
 * @param {String} url
 * @return {Function}
 */
function redirects(t, label, url) {
    return (err, res) => {
        t.comment(label);
        t.equal(302, res.status);
        t.equal(url, res.request.url);
    };
}

/**
 * @param {String | Number} size
 * @param {String} rating
 * @return {String}
 */
function gravatar_url(size, rating) {
    return 'http://www.gravatar.com/avatar/b642b4217b34b1e8d3bd915fc65c4452?d=' +
        encodeURIComponent(config('experience.fallback_avatar')) +
        `&s=${size}&r=${rating}`;
}
