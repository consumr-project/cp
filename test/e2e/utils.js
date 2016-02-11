'use strict';

/* global browser, element, by */

global.$ = selector =>
    element.all(by.css(selector)).first();

module.exports = {
    navigation: {
        home: () => browser.get('http://localhost:3000/'),
        company: (guid) => browser.get('http://localhost:3000/company/' + (guid ? guid : '')),
    }
};
