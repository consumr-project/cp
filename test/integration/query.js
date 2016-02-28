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

const fixture = clone(config('fixtures.integration_tests'));

test('query', t => {
    t.plan(1);

    login(fixture.user.admin).end((err, res) => {
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
});
