'use strict';

const tape = require('tape');
const http = require('../../integration/utils/http');

tape('page', t => {
    t.plan(6);

    http.get('/service/extract/page').end((err, res) => {
        t.comment('errors on empty request');
        t.error(err);
        t.equal(200, res.status);
        t.equal('error', res.body.body.type);
    });

    http.get('/service/extract/page?url=http://google.com').end((err, res) => {
        t.error(err);
        t.equal(200, res.status);
        t.equal('Google', res.body.body.title);
    });
});
