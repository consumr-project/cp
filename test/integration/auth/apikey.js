'use strict';

const tapes = require('tapes');
const http = require('../utils/http').create();
const auth = require('../utils/auth').create(http);

const config = require('acm');
const fixtures = config('fixtures');

tapes('guest', t => {
    t.plan(3);

    auth.login(fixtures.user.admin.auth_apikey).end((err, res) => {
        t.error(err, 'no error on login with apikey');
        t.equal(res.body.id, fixtures.user.admin.id, 'user id check');
    });

    t.test('user endpoint', st => {
        st.plan(3);

        http.get('/service/auth/user').end((err, res) => {
            st.error(err, 'can get the active user');
            st.equal(res.body.body.id, fixtures.user.admin.id, 'same user id');
            st.notEqual(res.body.email, fixtures.user.admin.raw_email, 'no raw email');
        });
    });

    t.test('user email endpoint', st => {
        st.plan(2);

        http.get('/service/auth/user/email').end((err, res) => {
            st.error(err, 'can get the active user email address');
            st.equal(res.body.body, fixtures.user.admin.raw_email, 'gets the raw email');
        });
    });

    auth.logout().end(err =>
        t.error(err, 'no error on logout'));
});
