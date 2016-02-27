'use strict';

const test = require('tape');
const get = require('./utils').get;

test('query', t => {
    t.plan(2);

    get('/query/users/e68a1d8e-256e-4dcd-b111-f7dd0e7f63e4').end((err, res) => {
        t.ok(res.body.meta.ok, 'successful query');
        t.equals(res.body.body.name, 'Zaphod Beeblebrox');
    });
});
