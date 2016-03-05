'use strict';

const cp = require('base-service/test/utils');
const config = require('acm');
const fixtures = config('fixtures');

cp.tapes('guest', t => {
    t.plan(3);

    cp.login(fixtures.user.admin.auth_apikey).end((err, res) => {
        t.error(err);
        t.equal(res.body.id, fixtures.user.admin.id);
    });

    cp.logout().end(err =>
        t.error(err));
});
