'use strict';

const test = require('tape');
const Manager = require('../../../build/auth/token').Manager;

test('token validation', t => {
    t.plan(5);

    var manager = new Manager();
    var lastyear = new Date();
    var nextyear = new Date();

    lastyear.setFullYear(lastyear.getFullYear() - 1);
    nextyear.setFullYear(nextyear.getFullYear() + 1);

    t.notOk(manager.valid(), 'blank token');

    t.notOk(manager.valid({
        token: null
    }), 'empty token');

    t.notOk(manager.valid({
        token: '123',
        used: true
    }), 'used token');

    t.notOk(manager.valid({
        token: '123',
        used: false,
        expiration_date: lastyear
    }), 'expired token');

    t.ok(manager.valid({
        token: '123',
        used: false,
        expiration_date: nextyear
    }), 'valid token');
});
