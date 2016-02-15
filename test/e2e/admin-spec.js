describe('admin', () => {
    /* global $, admin */
    'use strict';

    it('can log in through linkedin', () => {
        admin.login();
        expect($('avatar').getAttribute('email'))
            .toEqual(admin.login.user.email);
    });

    it('can go to the current users profile page', () => {
        $('avatar').click();
        $('[i18n="pages/profile"]').click();
        expect($('.avatar__name').getText())
            .toBe(admin.login.user.name);
    });

    it('can log out', () => {
        $('avatar').click();
        $('[i18n="admin/logout"]').click();
        expect($('[i18n="admin/sing_in_or_up"]').isPresent())
            .toBe(true);
    });
});
