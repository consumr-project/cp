'use strict';

const cp = require('base-service/test/utils');

cp.tapes('guest', t => {
    t.plan(1);

    t.comment('ensure logged out');
    cp.logout().end(err =>
        t.error(err));

    t.test('guest user', st => {
        st.plan(2);

        cp.user().end((err, res) => {
            st.comment('default user object');
            st.ok(res.body.role, 'has a role');
            st.equal(res.body.role, 'guest', 'and is a guest');
        });
    });
});
