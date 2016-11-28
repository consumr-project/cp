'use strict';

const tapes = require('tapes');
const http = require('../utils/http').create();
const auth = require('../utils/auth').create(http);

tapes('guest', t => {
    t.plan(1);

    auth.logout().end(err =>
        t.error(err, 'logged out'));

    t.test('guest user', st => {
        st.plan(2);

        auth.user().end((err, res) => {
            st.ok(res.body.body.role, 'has a role');
            st.equal(res.body.body.role, 'guest', 'and is a guest');
        });
    });
});
