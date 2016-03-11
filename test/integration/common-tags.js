'use strict';

const cp = require('base-service/test/utils');
const clone = require('lodash').clone;
const config = require('acm');
const fixture = clone(config('fixtures'));

// XXX fix in base-service
cp.patch = (path, data) => {
    // console.log('==================================');
    // console.log(path);
    // console.log(JSON.stringify(data));
    // console.log('==================================');
    return cp.agent.patch(process.env.TEST_SERVICE_URL + path).send(data);
};

// for (var i = 0; i < 10; i++)
cp.tapes('common tag', t => {
    t.plan(1);

    cp.login(fixture.user.admin.auth_apikey).end((err, res) => {
        t.error(err);

        fixture.company.created_by = res.body.id;
        fixture.company.updated_by = res.body.id;

        fixture.events.forEach(ev => {
            ev.created_by = res.body.id;
            ev.updated_by = res.body.id;
        });

        fixture.tags.forEach(tag => {
            tag.created_by = res.body.id;
            tag.updated_by = res.body.id;
        });
    });

    t.test('reset', st => {
        st.plan(
            1 +
            fixture.events.length +
            fixture.tags.length
        );

        cp.purge(`/companies/${fixture.company.id}`).end((err, res) =>
            st.ok(res.body.meta.ok, 'deleted test company'));

        fixture.events.forEach(ev =>
            cp.purge(`/events/${ev.id}`).end((err, res) =>
                st.ok(res.body.meta.ok, `deleted test event (${ev.id})`)));

        fixture.tags.forEach(tag =>
            cp.purge(`/tags/${tag.id}`).end((err, res) =>
                st.ok(res.body.meta.ok, `deleted test tag (${tag.id})`)));
    });

    t.test('setup', st => {
        st.plan(
            // creation
            2 +
            fixture.events.length * 2 +
            fixture.tags.length * 2 +

            // linking
            // 12 * 2 +
            // fixture.events.length * 2
            0
        );

        cp.post('/companies', fixture.company).end((err, res) => {
            st.error(err);
            st.ok(res.body.meta.ok, `created test company (${fixture.company.id})`);
        });

        fixture.events.forEach(ev =>
            cp.post('/events', ev).end((err, res) => {
                st.error(err, 'no error');
                st.ok(res.body.meta.ok, `created test event (${ev.id})`);
            }));

        fixture.tags.forEach(tag =>
            cp.post('/tags', tag).end((err, res) => {
                st.error(err, 'no error');
                st.ok(res.body.meta.ok, `created test tag (${tag.id})`);
            }));

        // fixture.events.forEach(ev =>
        //     cp.patch(`/companies/${fixture.company.id}/events`, {
        //         event_id: ev.id
        //     }).end((err, res) => {
        //         if (err) {
        //             console.log('=========================')
        //             console.log(err)
        //             console.log('=========================')
        //             process.exit();
        //         }
        //         st.error(err, 'no error');
        //         st.ok(res.body.meta.ok, `linking company to event (${ev.id})`);
        //     }));

        // [
        //     [ fixture.events[0], [ fixture.tags[0], fixture.tags[1], fixture.tags[2] ] ],
        //     [ fixture.events[1], [ fixture.tags[0], fixture.tags[1], fixture.tags[2] ] ],
        //     [ fixture.events[2], [ fixture.tags[1], fixture.tags[3], fixture.tags[4] ] ],
        //     [ fixture.events[3], [ fixture.tags[1], fixture.tags[5], fixture.tags[2] ] ],
        // ].forEach(entities => {
        //     var ev = entities[0],
        //         tags = entities[1];
        //
        //     tags.forEach(tag => {
        //         cp.patch(`/events/${ev.id}/tags`, {
        //             tag_id: tag.id
        //         }).end((err, res) => {
        //             st.error(err, 'no error');
        //             st.ok(res.body.meta.ok, `linking event to tag (${tag.id})`);
        //         });
        //     });
        // });
    });

    // t.test('create event', st => {
    //     st.plan(2);
    //
    //     cp.get(`/companies/${fixture.company.id}/events/tags/common`).end((err, res) => {
    //         var tags = fixture.tags;
    //         var common = res.body.body;
    //
    //         st.error(err);
    //         st.ok(res.body.meta.ok, 'can create an event');
    //
    //         // st.equal(common[0].id, tags[1].id);
    //     });
    // });

    t.test('reset', st => {
        st.plan(
            1 +
            fixture.events.length +
            fixture.tags.length
        );

        cp.purge(`/companies/${fixture.company.id}`).end((err, res) =>
            st.ok(res.body.meta.ok, 'deleted test company'));

        fixture.events.forEach(ev =>
            cp.purge(`/events/${ev.id}`).end((err, res) =>
                st.ok(res.body.meta.ok, `deleted test event (${ev.id})`)));

        fixture.tags.forEach(tag =>
            cp.purge(`/tags/${tag.id}`).end((err, res) =>
                st.ok(res.body.meta.ok, `deleted test tag (${tag.id})`)));
    });
});
