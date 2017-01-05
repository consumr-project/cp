'use strict';

const tapes = require('tapes');
const create_http = require('../utils/http').create;
const create_auth = require('../utils/auth').create;

const http = create_http();
const auth = create_auth(http);

const clone = require('lodash').clone;
const config = require('acm');
const fixture = clone(config('fixtures'));

tapes('site stats', t => {
    t.plan(1);

    http.get('/service/record/stats/site').end((err, res) => {
        t.equal(res.status, 401, 'requires admin rights');
    });

    t.test('properties', st => {
        st.plan(8);

        auth.login(fixture.user.admin.auth_apikey).end(err => {
            st.error(err, 'logged in without error');

            http.get('/service/record/stats/site').end((err, res) => {
                st.error(err, 'no error when admin');
                st.ok(res.body.meta.ok, 'proper respose metadata');
                st.ok('companies' in res.body.body, 'has companies in response');
                st.ok('users' in res.body.body, 'has users in response');
                st.ok('events' in res.body.body, 'has events in response');
                st.ok('tags' in res.body.body, 'has tags in response');
                st.ok('reviews' in res.body.body, 'has reviews in response');
            });
        });
    });
});
