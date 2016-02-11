'use strict';

/* global $ */

const admin = require('./utils').admin;

describe('login', () => {
    it('logs in through linkedin', () => {
        admin.login();
        expect($('.avatar__imag')).not.toBeNull();
    });
});
