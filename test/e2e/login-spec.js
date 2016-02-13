describe('login', () => {
    /* global $, admin */
    'use strict';

    it('logs in through linkedin', () => {
        admin.login();
        expect($('avatar').getAttribute('email'))
            .toEqual(admin.login.user.email);
    });
});
