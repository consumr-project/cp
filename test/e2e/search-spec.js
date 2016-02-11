'use strict';

/* global $ */

const nav = require('./utils').navigation;

describe('search', () => {
    beforeEach(() =>
        nav.home());

    it('search from the home page', () => {
        $('.search__input')
            .sendKeys('walmart neighborhood market')
            .submit();

        expect($('.search__result h2').getText())
            .toEqual('Walmart Neighborhood Market');
    });

    it('navigates to the company page', () => {
        $('.search__input')
            .sendKeys('walmart neighborhood market')
            .submit();

        $('.search__result').click();

        expect($(('.site-content--main h1')).getText())
            .toEqual('Walmart Neighborhood Market');
    });

    it('search from the home page', () => {
        nav.company('walmart-neighborhood-market');

        $('.search__input')
            .sendKeys('walmart neighborhood market')
            .submit();

        expect($('.search__result h2').getText())
            .toEqual('Walmart Neighborhood Market');
    });

    it('shows a create link when no results are found', () => {
        var str = 'randomstringdoesnotexist';

        $('.search__input')
            .sendKeys(str)
            .submit();

        expect($('[i18n="common/no_results"]').getText())
            .toEqual(`No results for "${str}"`);

        expect($('[i18n="common/create_this"]').getText())
            .toEqual(`create "${str}"?`);
    });
});
