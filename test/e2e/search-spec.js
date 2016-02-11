'use strict';

/* global browser, $ */

const nav = require('./utils').navigation;

describe('search', () => {
    beforeEach(() =>
        nav.home());

    it('search from the home page', () => {
        $('.search__input')
            .sendKeys('walmart neighborhood market')
            .submit();

        expect($(('.search__result h2')).getText())
            .toEqual('Walmart Neighborhood Market');
    });
});
