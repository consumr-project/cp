describe('login', () => {
    /* global $, admin */
    'use strict';

    it('can logs in through linkedin', () => {
        admin.login();
        expect($('avatar').getAttribute('email'))
            .toEqual(admin.login.user.email);
    });

    it('logs out', () => {
        $('avatar').click();
        $('[i18n="admin/logout"]').click();
        expect($('[i18n="admin/sing_in_or_up"]').isPresent())
            .toBe(true);
    });
});
