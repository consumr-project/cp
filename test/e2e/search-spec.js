'use strict';

/* global browser, $ */

const navigation = require('./utils').navigation;

describe('search', () => {
    beforeEach(() =>
        browser.get(navigation.home()));

    it('search from the home page', () => {
        $('.search__input')
            .sendKeys('walmart neighborhood market')
            .submit();

        expect($(('.search__result h2')).getText())
            .toEqual('Walmart Neighborhood Market');
    });
});
