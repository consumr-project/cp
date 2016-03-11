'use strict';

const cp = require('base-service/test/utils');
const clone = require('lodash').clone;
const config = require('acm');
const fixture = clone(config('fixtures'));

cp.tapes('company', t => {
    t.plan(1);

    cp.login(fixture.user.admin.auth_apikey).end((err, res) => {
        t.error(err);

        fixture.company.created_by = res.body.id;
        fixture.company.updated_by = res.body.id;
    });

    t.test('setup', st => {
        st.plan(1);

        cp.purge(`/companies/${fixture.company.id}`).end((err, res) =>
            st.ok(res.body.meta.ok, 'deleted test company'));
    });

    t.test('create company', st => {
        st.plan(1);

        cp.post('/companies', fixture.company).end((err, res) => {
            st.ok(res.body.meta.ok, 'can create a company');
        });
    });

    t.test('get company', st => {
        st.plan(2);

        cp.get(`/companies/${fixture.company.id}`).end((err, res) => {
            st.ok(res.body.meta.ok, 'can retrieve a company');
            st.equal(fixture.company.name, res.body.body.name);
        });
    });

    t.test('delete company', st => {
        st.plan(2);

        cp.del(`/companies/${fixture.company.id}`).end((err, res) => {
            st.ok(res.body.meta.ok, 'can delete a company');

            cp.get(`/companies/${fixture.company.id}`).end((err, res) => {
                st.ok(res.body.body.deleted_date);
            });
        });
    });

    t.test('purge company', st => {
        st.plan(2);

        cp.purge(`/companies/${fixture.company.id}`).end((err, res) => {
            st.ok(res.body.meta.ok, 'deleted test company');

            cp.get(`/companies/${fixture.company.id}`).end((err, res) => {
                st.notOk(res.body.body);
            });
        });
    });
});
