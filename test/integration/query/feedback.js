'use strict';

const tapes = require('tapes');
const http = require('../utils/http');
const auth = require('../utils/auth');

const clone = require('lodash').clone;
const config = require('acm');
const fixture = clone(config('fixtures'));

tapes('feedback', t => {
    t.plan(1);

    auth.login(fixture.user.admin.auth_apikey).end((err, res) => {
        t.error(err);
    });

    clean_up();

    t.test('setup', st => {
        st.plan(fixture.feedback.length);

        fixture.feedback.forEach(feedback =>
            http.post('/service/query/feedback', feedback).end((err, res) => {
                st.ok(res.body.meta.ok, `created test feedback (${feedback.id})`);
            }));
    });

    t.test('check', st => {
        st.plan(fixture.feedback.length * 6);

        fixture.feedback.forEach(feedback =>
            http.get(`/service/query/feedback/${feedback.id}`).end((err, res) => {
                st.error(err);
                st.equal(res.body.body.id, feedback.id);
                st.equal(res.body.body.referrer, feedback.referrer);
                st.equal(res.body.body.type, feedback.type);
                st.equal(res.body.body.message, feedback.message);
                st.equal(res.body.body.user_id, feedback.user_id);
            }));
    });

    clean_up();

    function clean_up() {
        t.test('cleanup', st => {
            st.plan(fixture.feedback.length);

            fixture.feedback.forEach(feedback =>
                http.purge(`/service/query/feedback/${feedback.id}`).end((err, res) => {
                    st.ok(res.body.meta.ok, `deleted test feedback (${feedback.id})`);
                }));
        });
    }
});
