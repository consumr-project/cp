'use strict';

const tape = require('tape');
const http = require('../../integration/utils/http');
const check = require('../../integration/utils/check');

tape('wiki', t => {
    t.plan(15);
    // t.plan(20);

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

    // XXX some changes being currently done to Walmart's re the name that
    // should be used in their infobox. commenting out until that's settled.
    // https://en.wikipedia.org/wiki/Walmart
    // https://en.wikipedia.org/w/index.php?title=Walmart&action=history
    // http.get('/service/extract/wiki/infobox?q=Walmart').end((err, res) => {
    //     t.comment('infobox');
    //     check.rescheck(t, err, res);
    //     t.equal('Walmart Stores, Inc.', res.body.body.infobox.name);
    // });

    http.get('/service/extract/wiki/infobox?q=Walmart&parts=urls').end((err, res) => {
        t.comment('infobox with parts');
        check.rescheck(t, err, res);
        t.deepEqual(res.body.body.parts.urls,
            [ 'http://corporate.walmart.com/', 'https://www.walmart.com/' ]);
    });
});
