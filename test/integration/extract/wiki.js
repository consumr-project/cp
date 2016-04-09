'use strict';

const tape = require('tape');
const http = require('../utils/http');
const check = require('../utils/check');

tape('wiki', t => {
    t.plan(20);

    http.get('/service/extract/wiki/search?q=Walmart').end((err, res) => {
        t.comment('search');
        check.rescheck(t, err, res);
        t.equal('Walmart', res.body.body[0].title);
    });

    http.get('/service/extract/wiki/extract?q=Walmart').end((err, res) => {
        t.comment('extract');
        check.rescheck(t, err, res);
        t.equal(33589, res.body.body.id);
    });

    http.get('/service/extract/wiki/infobox?q=Walmart').end((err, res) => {
        t.comment('infobox');
        check.rescheck(t, err, res);
        t.equal('Wal-Mart Stores, Inc.', res.body.body.infobox.name);
    });

    http.get('/service/extract/wiki/infobox?q=Walmart&parts=urls').end((err, res) => {
        t.comment('infobox with parts');
        check.rescheck(t, err, res);
        t.deepEqual(res.body.body.parts.urls,
            [ 'http://corporate.walmart.com/', 'http://www.walmart.com/' ]);
    });
});
