'use strict';

const tapes = require('tapes');
const http = require('../utils/http').create();
const auth = require('../utils/auth').create(http);

tapes('guest', t => {
    t.plan(1);

    t.comment('ensure logged out');
    auth.logout().end(err =>
        t.error(err));

    t.test('guest user', st => {
        st.plan(2);

        auth.user().end((err, res) => {
            st.comment('default user object');
            st.ok(res.body.role, 'has a role');
            st.equal(res.body.role, 'guest', 'and is a guest');
        });
    });
});
