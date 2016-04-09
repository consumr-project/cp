'use strict';

const cp = require('./utils');

cp.tape('wiki', t => {
    t.plan(20);

    cp.get('/service/extract/wiki/search?q=Walmart').end((err, res) => {
        t.comment('search');
        cp.rescheck(t, err, res);
        t.equal('Walmart', res.body.body[0].title);
    });

    cp.get('/service/extract/wiki/extract?q=Walmart').end((err, res) => {
        t.comment('extract');
        cp.rescheck(t, err, res);
        t.equal(33589, res.body.body.id);
    });

    cp.get('/service/extract/wiki/infobox?q=Walmart').end((err, res) => {
        t.comment('infobox');
        cp.rescheck(t, err, res);
        t.equal('Wal-Mart Stores, Inc.', res.body.body.infobox.name);
    });

    cp.get('/service/extract/wiki/infobox?q=Walmart&parts=urls').end((err, res) => {
        t.comment('infobox with parts');
        cp.rescheck(t, err, res);
        t.deepEqual(res.body.body.parts.urls,
            [ 'http://corporate.walmart.com/', 'http://www.walmart.com/' ]);
    });
});
