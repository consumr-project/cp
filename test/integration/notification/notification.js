'use strict';

const tapes = require('tapes');
const http = require('../utils/http');
const auth = require('../utils/auth');

const map = require('lodash').map;
const find = require('lodash').find;
const clone = require('lodash').clone;
const config = require('acm');
const fixture = clone(config('fixtures'));

tapes('notifications', t => {
    var ids_to_look_for = [],
        ids_to_delete = [];

    t.plan(1);

    auth.login(fixture.user.admin.auth_apikey).end((err, res) => {
        t.error(err);
    });

    t.test('create', st => {
        st.plan(1);

        http.post('/service/notification/follow', {
            id: fixture.user.admin.id,
        }).end((err, res) => {
            st.error(err);
            ids_to_look_for.push(res.body.body.id);
        });
    });

    t.test('retrieve', st => {
        st.plan(ids_to_look_for.length + 1);

        http.get('/service/notification').end((err, res) => {
            ids_to_delete = map(res.body.body, 'id');
            st.error(err);

            ids_to_look_for.forEach(id =>
                st.ok(find(res.body.body, {id})));
        });
    });

    t.test('purge', st => {
        st.plan(ids_to_delete.length);

        ids_to_delete.forEach(id => {
            http.purge(`/service/notification/${id}`).end((err, res) => {
                st.error(err);
            });
        });
    });
});
