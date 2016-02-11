'use strict';

const test = require('tape');
const get = require('./utils').get;

test('wiki', t => {
    t.plan(6);

    get('/wiki/search?q=Walmart').end((err, res) => {
        t.error(err);
        t.equal(200, res.status);
        t.equal('Walmart', res.body.body[0].title);
    });

    get('/wiki/extract?q=Walmart').end((err, res) => {
        t.error(err);
        t.equal(200, res.status);
        t.equal(33589, res.body.body.id);
    });
});
