'use strict';

const cp = require('base-service/test/utils');
const clone = require('lodash').clone;
const config = require('acm');
const fixture = clone(config('fixtures'));

cp.tapes('tag', t => {
    t.plan(1);

    cp.login(fixture.user.admin.auth_apikey).end((err, res) => {
        t.error(err);

        fixture.events.forEach(ev => {
            ev.created_by = res.body.id;
            ev.updated_by = res.body.id;
        });
    });

    t.test('setup', st => {
        st.plan(fixture.events.length);

        fixture.events.forEach(ev =>
            cp.purge(`/events/${ev.id}`).end((err, res) =>
                st.ok(res.body.meta.ok, 'deleted test event')));
    });

    t.test('create event', st => {
        st.plan(2);

        cp.post('/events', fixture.events[0]).end((err, res) => {
            st.error(err);
            st.ok(res.body.meta.ok, 'can create an event');
        });
    });

    t.test('get event', st => {
        st.plan(2);

        cp.get(`/events/${fixture.events[0].id}`).end((err, res) => {
            st.ok(res.body.meta.ok, 'can retrieve an event');
            st.equal(fixture.events[0].title, res.body.body.title);
        });
    });

    t.test('delete event', st => {
        st.plan(2);

        cp.del(`/events/${fixture.events[0].id}`).end((err, res) => {
            st.ok(res.body.meta.ok, 'can delete an event');

            cp.get(`/events/${fixture.events[0].id}`).end((err, res) => {
                // `parts` method never includes deleted items
                st.ok(res.body.meta.ok);
            });
        });
    });

    t.test('purge event', st => {
        st.plan(2);

        cp.purge(`/events/${fixture.events[0].id}`).end((err, res) => {
            st.ok(res.body.meta.ok, 'deleted test event');

            cp.get(`/events/${fixture.events[0].id}`).end((err, res) => {
                st.notOk(res.body.body);
            });
        });
    });
});
