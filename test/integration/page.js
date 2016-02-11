'use strict';

const test = require('tape');
const get = require('./utils').get;

test('page', t => {
    t.plan(6);

    get('/page').end((err, res) => {
        t.comment('errors on empty request');
        t.error(err);
        t.equal(200, res.status);
        t.equal('error', res.body.body.type);
    });

    get('/page?url=http://google.com').end((err, res) => {
        t.error(err);
        t.equal(200, res.status);
        t.equal('Google', res.body.body.title);
    });
});
