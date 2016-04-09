'use strict';

const cp = require('./utils');

cp.tape('page', t => {
    t.plan(6);

    cp.get('/service/extract/page').end((err, res) => {
        t.comment('errors on empty request');
        t.error(err);
        t.equal(200, res.status);
        t.equal('error', res.body.body.type);
    });

    cp.get('/service/extract/page?url=http://google.com').end((err, res) => {
        t.error(err);
        t.equal(200, res.status);
        t.equal('Google', res.body.body.title);
    });
});
