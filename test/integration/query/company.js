'use strict';

const tapes = require('tapes');
const http = require('../utils/http');
const auth = require('../utils/auth');

const clone = require('lodash').clone;
const config = require('acm');
const fixture = clone(config('fixtures'));

tapes('company', t => {
    t.plan(1);

    auth.login(fixture.user.admin.auth_apikey).end((err, res) => {
        t.error(err);

        fixture.company.created_by = res.body.id;
        fixture.company.updated_by = res.body.id;
    });

    t.test('setup', st => {
        st.plan(1);

        http.purge(`/service/query/companies/${fixture.company.id}`).end((err, res) =>
            st.ok(res.body.meta.ok, 'deleted test company'));
    });

    t.test('create company', st => {
        st.plan(1);

        http.post('/service/query/companies', fixture.company).end((err, res) => {
            st.ok(res.body.meta.ok, 'can create a company');
        });
    });

    t.test('get company', st => {
        st.plan(2);

        http.get(`/service/query/companies/${fixture.company.id}`).end((err, res) => {
            st.ok(res.body.meta.ok, 'can retrieve a company');
            st.equal(fixture.company.name, res.body.body.name);
        });
    });

    t.test('delete company', st => {
        st.plan(2);

        http.del(`/service/query/companies/${fixture.company.id}`).end((err, res) => {
            st.ok(res.body.meta.ok, 'can delete a company');

            http.get(`/service/query/companies/${fixture.company.id}`).end((err, res) => {
                st.ok(res.body.body.deleted_date);
            });
        });
    });

    t.test('purge company', st => {
        st.plan(2);

        http.purge(`/service/query/companies/${fixture.company.id}`).end((err, res) => {
            st.ok(res.body.meta.ok, 'deleted test company');

            http.get(`/service/query/companies/${fixture.company.id}`).end((err, res) => {
                st.notOk(res.body.body);
            });
        });
    });
});
