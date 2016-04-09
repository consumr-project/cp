'use strict';

const tapes = require('tapes');
const auth = require('../utils/auth');

const config = require('acm');
const fixtures = config('fixtures');

tapes('guest', t => {
    t.plan(3);

    auth.login(fixtures.user.admin.auth_apikey).end((err, res) => {
        t.error(err);
        t.equal(res.body.id, fixtures.user.admin.id);
    });

    auth.logout().end(err =>
        t.error(err));
});
