'use strict';

const tape = require('tape');
const http = require('../utils/http');
const auth = require('../utils/auth');

const clone = require('lodash').clone;
const config = require('acm');
const fixture = clone(config('fixtures'));

tape('avatar', t => {
    t.plan(2);

    auth.login(fixture.user.admin.auth_apikey).end((err, res) => {
        t.error(err);
    });

    t.test('url', st => {
        st.plan(6);

        http.get('/service/user/avatar?email=' + fixture.user.admin.email)
            .redirects(1)
            .end(redirects(st, 'goes gravatar test url', gravatar_url(512, 'g')));

        http.get('/service/user/avatar?size=1024&email=' + fixture.user.admin.email)
            .redirects(1)
            .end(redirects(st, 'specify size', gravatar_url(1024, 'g')));

        http.get('/service/user/avatar?rating=pg&email=' + fixture.user.admin.email)
            .redirects(1)
            .end(redirects(st, 'specify rating', gravatar_url(512, 'pg')));
    });
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
    return 'http://www.gravatar.com/avatar/d36f6a3a4134faeac306ea1bd0828352?d=' +
        encodeURIComponent(config('experience.fallback_avatar')) +
        `&s=${size}&r=${rating}`;
}
