'use strict';

const test = require('tape');
const get = require('./utils').get;

test('wiki', t => {
    t.plan(16);

    get('/wiki/search?q=Walmart').end((err, res) => {
        t.comment('search')
        rescheck(t, err, res);
        t.equal('Walmart', res.body.body[0].title);
    });

    get('/wiki/extract?q=Walmart').end((err, res) => {
        t.comment('extract')
        rescheck(t, err, res);
        t.equal(33589, res.body.body.id);
    });

    get('/wiki/infobox?q=Walmart').end((err, res) => {
        t.comment('infobox')
        rescheck(t, err, res);
        t.equal('Wal-Mart Stores, Inc.', res.body.body.infobox.name);
    });

    get('/wiki/infobox?q=Walmart&parts=urls').end((err, res) => {
        t.comment('infobox with parts')
        rescheck(t, err, res);
        t.deepEqual(res.body.body.parts.urls,
            [ 'http://corporate.walmart.com/', 'http://www.walmart.com/' ]);
    });
});

/**
 * @param {Tape} t
 * @param {Error} [err]
 * @param {Response} res
 * @return {void}
 */
function rescheck(t, err, res) {
    t.error(err);
    t.equal(200, res.status);
    t.ok(res.body.body, 'has a service response body');
}
