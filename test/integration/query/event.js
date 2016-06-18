'use strict';

const tapes = require('tapes');
const http = require('../utils/http');
const auth = require('../utils/auth');

const clone = require('lodash').clone;
const config = require('acm');
const fixture = clone(config('fixtures'));

tapes('event', t => {
    t.plan(1);

    auth.login(fixture.user.admin.auth_apikey).end((err, res) => {
        t.error(err);

        fixture.events.forEach(ev => {
            ev.created_by = res.body.id;
            ev.updated_by = res.body.id;
        });
    });

    t.test('setup', st => {
        st.plan(fixture.events.length);

        fixture.events.forEach(ev =>
            http.purge(`/service/record/events/${ev.id}`).end((err, res) =>
                st.ok(res.body.meta.ok, 'deleted test event')));
    });

    t.test('create event', st => {
        st.plan(2);

        http.post('/service/record/events', fixture.events[0]).end((err, res) => {
            st.error(err);
            st.ok(res.body.meta.ok, 'can create an event');
        });
    });

    t.test('get event', st => {
        st.plan(2);

        http.get(`/service/record/events/${fixture.events[0].id}`).end((err, res) => {
            st.ok(res.body.meta.ok, 'can retrieve an event');
            st.equal(fixture.events[0].title, res.body.body.title);
        });
    });

    t.test('delete event', st => {
        st.plan(3);

        http.del(`/service/record/events/${fixture.events[0].id}`).end((err, res) => {
            st.ok(res.body.meta.ok, 'can delete an event');

            http.get(`/service/record/events/${fixture.events[0].id}`).end((err, res) => {
                st.ok(res.body.meta.ok);
                st.ok(res.body.body.id);
            });
        });
    });

    t.test('purge event', st => {
        st.plan(2);

        http.purge(`/service/record/events/${fixture.events[0].id}`).end((err, res) => {
            st.ok(res.body.meta.ok, 'deleted test event');

            http.get(`/service/record/events/${fixture.events[0].id}`).end((err, res) => {
                st.notOk(res.body.body);
            });
        });
    });
});
