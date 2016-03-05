'use strict';

const cp = require('base-service/test/utils');

cp.tape('avatar', t => {
    t.plan(9);

    cp.get('/avatar?email=test@test.com').end((err, res) => {
        t.comment('goes gravatar test url');
        t.error(err);
        t.equal(200, res.status);
        t.equal('http://www.gravatar.com/avatar/b642b4217b34b1e8d3bd915fc65c4452?d=&s=512&r=g',
            res.request.url);
    });

    cp.get('/avatar?email=test@test.com&size=1024').end((err, res) => {
        t.comment('specify size');
        t.error(err);
        t.equal(200, res.status);
        t.equal('http://www.gravatar.com/avatar/b642b4217b34b1e8d3bd915fc65c4452?d=&s=1024&r=g',
            res.request.url);
    });

    cp.get('/avatar?email=test@test.com&rating=pg').end((err, res) => {
        t.comment('specify rating');
        t.error(err);
        t.equal(200, res.status);
        t.equal('http://www.gravatar.com/avatar/b642b4217b34b1e8d3bd915fc65c4452?d=&s=512&r=pg',
            res.request.url);
    });
});
