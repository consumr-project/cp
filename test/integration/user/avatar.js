'use strict';

const tapes = require('tapes');
const http = require('../utils/http');
const auth = require('../utils/auth');
const email = require('../utils/crypto').email;

const clone = require('lodash').clone;
const config = require('acm');
const fixture = clone(config('fixtures'));

tapes('avatar', t => {
    t.plan(1);

    auth.login(fixture.user.admin.auth_apikey).end((err, res) => {
        t.error(err, 'authenticated');
    });

    t.test('redirect', st => {
        st.plan(12);

        http.get('/service/user/avatar?id=' + fixture.user.admin.id)
            .redirects(1)
            .end(redirects(st, 'goes gravatar test url', gravatar_url(512, 'g')));

        http.get('/service/user/avatar?size=1024&id=' + fixture.user.admin.id)
            .redirects(1)
            .end(redirects(st, 'specify size', gravatar_url(1024, 'g')));

        http.get('/service/user/avatar?rating=pg&id=' + fixture.user.admin.id)
            .redirects(1)
            .end(redirects(st, 'specify rating', gravatar_url(512, 'pg')));

        http.get('/service/user/avatar?email=' + email(fixture.user.admin.raw_email))
            .redirects(1)
            .end(redirects(st, 'goes gravatar test url', gravatar_url(512, 'g')));

        http.get('/service/user/avatar?size=1024&email=' + email(fixture.user.admin.raw_email))
            .redirects(1)
            .end(redirects(st, 'specify size', gravatar_url(1024, 'g')));

        http.get('/service/user/avatar?rating=pg&email=' + email(fixture.user.admin.raw_email))
            .redirects(1)
            .end(redirects(st, 'specify rating', gravatar_url(512, 'pg')));
    });

    t.test('error', st => {
        st.plan(1);

        http.get('/service/user/avatar').end((err, res) => {
            st.equal(400, res.status, 'returns 400 status code');
        });
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
        t.equal(302, res.status, 'returned a 302');
        t.equal(url, res.request.url, 'has the same url');
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
