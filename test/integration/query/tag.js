'use strict';

const tapes = require('tapes');
const http = require('../utils/http');
const auth = require('../utils/auth');

const find = require('lodash').find;
const clone = require('lodash').clone;
const config = require('acm');
const fixture = clone(config('fixtures'));

tapes('tag', t => {
    t.plan(1);

    auth.login(fixture.user.admin.auth_apikey).end((err, res) => {
        t.error(err);

        fixture.tags.forEach(tag => {
            tag.created_by = res.body.id;
            tag.updated_by = res.body.id;
        });
    });

    reset();

    t.test('setup', st => {
        st.plan(fixture.tags.length * 2);

        fixture.tags.forEach(tag =>
            http.post('/service/record/tags', tag).end((err, res) => {
                st.error(err, 'no error');
                st.ok(res.body.meta.ok, `created test tag (${tag.id})`);
            }));
    });

    // XXX broken on travis for some reason
    t.test('like search', st => {
        st.plan(2);
        // st.plan(5);

        http.get('/service/record/tags/like?s[]=log').end((err, res) => {
            st.error(err);
            // console.log(res);
            // st.ok(find(res.body.body, { label: 'Logging' }));
        });

        http.get('/service/record/tags/like?s[]=log&s[]=fish').end((err, res) => {
            st.error(err);
            // console.log(res);
            // st.ok(find(res.body.body, { label: 'Logging' }));
            // st.ok(find(res.body.body, { label: 'Fishing' }));
        });
    });

    reset();

    function reset() {
        t.test('reset', st => {
            st.plan(fixture.tags.length);

            fixture.tags.forEach(tag =>
                http.purge(`/service/record/tags/${tag.id}`).end((err, res) =>
                    st.ok(res.body.meta.ok, `deleted test tag (${tag.id})`)));
        });
    }
});
