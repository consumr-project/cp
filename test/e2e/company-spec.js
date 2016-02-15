describe('company', () => {
    /* global $, $$, navigation */
    'use strict';

    beforeEach(() =>
        navigation.company());

    it('can search for a company', () => {
        $('[i18n="company/name_placeholder"]')
            .sendKeys('Walmart');

        expect($('.highlight-action b').getText())
            .toEqual('Walmart');

        expect($('.highlight-action span').getText())
            .toEqual(
                ': the retail chain. For other uses, see Walmart ' +
                '(disambiguation). Wal-Mart Stores, Inc., doing business as ' +
                'Walmart /ˈwɔːlmɑːrt/, is an American multinational');
    });

    it('can select a company and then go back', () => {
        $('[i18n="company/name_placeholder"]')
            .sendKeys('Walmart');

        $('.highlight-action').click();
        $('[i18n="admin/go_back"]').click();

        expect($('.highlight-action b').getText())
            .toEqual('Walmart');

        expect($('.highlight-action span').getText())
            .toEqual(
                ': the retail chain. For other uses, see Walmart ' +
                '(disambiguation). Wal-Mart Stores, Inc., doing business as ' +
                'Walmart /ˈwɔːlmɑːrt/, is an American multinational');
    });

    it('selects a company to add it', () => {
        $('[i18n="company/name_placeholder"]')
            .sendKeys('Walmart');

        $('.highlight-action')
            .click();

        expect($$('[i18n="admin/this_is_it"]').count())
            .toEqual(1);
    });

    it('lets the user type in a company url and it has a default', () => {
        $('[i18n="company/name_placeholder"]')
            .sendKeys('Walmart');

        $('.highlight-action')
            .click();

        $('[i18n="admin/this_is_it"]')
            .click();

        expect($$('[i18n="company/what_is_the_website"]').count())
            .toEqual(1);

        expect($('[ng-model="company.website_url"]').getAttribute('value'))
            .toEqual('https://walmart.com');
    });

    it('lets the user type in products', () => {
        $('[i18n="company/name_placeholder"]')
            .sendKeys('Walmart');

        $('.highlight-action')
            .click();

        $('[i18n="admin/this_is_it"]').click();
        $('[i18n="admin/this_is_it"]').click();

        expect($$('[i18n="company/what_do_they_do"]').count())
            .toEqual(1);
    });
});
