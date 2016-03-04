'use strict';

const config = require('acm');
const test = require('tapes');
const clone = require('lodash').clone;

const get = require('./utils').get;
const post = require('./utils').post;
const put = require('./utils').put;
const del = require('./utils').del;
const purge = require('./utils').purge;
const patch = require('./utils').patch;

const user = require('./utils').user;
const login = require('./utils').login;
const logout = require('./utils').logout;

const fixture = clone(config('fixtures'));

test('query', t => {
    t.plan(1);

    login(fixture.user.admin.auth_apikey).end((err, res) => {
        t.error(err);

        fixture.company.created_by = res.body.id;
        fixture.company.updated_by = res.body.id;
    });

    t.test('setup', st => {
        st.plan(1);

        purge('/companies/' + fixture.company.id).end((err, res) => {
            st.ok(res.body.meta.ok, 'deleted test company');
        });
    });

    t.test('create company', st => {
        st.plan(1);

        post('/companies', fixture.company).end((err, res) => {
            st.ok(res.body.meta.ok, 'can create a company');
        });
    });

    t.test('get company', st => {
        st.plan(2);

        get('/companies/' + fixture.company.id).end((err, res) => {
            st.ok(res.body.meta.ok, 'can retrieve a company');
            st.equal(fixture.company.name, res.body.body.name);
        });
    });

    t.test('delete company', st => {
        st.plan(2);

        del('/companies/' + fixture.company.id).end((err, res) => {
            st.ok(res.body.meta.ok, 'can delete a company');

            get('/companies/' + fixture.company.id).end((err, res) => {
                st.ok(res.body.body.deleted_date)
            });
        });
    });

    t.test('purge company', st => {
        st.plan(2);

        purge('/companies/' + fixture.company.id).end((err, res) => {
            st.ok(res.body.meta.ok, 'deleted test company');

            get('/companies/' + fixture.company.id).end((err, res) => {
                st.notOk(res.body.body)
            });
        });
    });
});
