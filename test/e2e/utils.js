'use strict';

/* global browser, element, by */
var wait = global.wait = ms =>
    browser.sleep(ms || 100);

var $ = global.$ = selector =>
    element.all(by.css(selector)).first();

var util = module.exports = {
    switch_to: index =>
        browser.getAllWindowHandles().then(handles =>
            browser.switchTo().window(handles[index])),

    admin: {
        login: () => {
            util.navigation.home();

            $('[i18n="admin/sing_in_or_up"]').click();
            $('[i18n="admin/sing_in_with_service"]').click();
            $('[i18n="admin/remind_later"]').click();

            // browser.driver.ignoreSynchronization = true;
            util.switch_to(1);

            browser.driver.findElement(by.id('session_key-oauth2SAuthorizeForm'))
                .sendKeys(process.env.LINKEDIN_USER);

            browser.driver.findElement(by.id('session_password-oauth2SAuthorizeForm'))
                .sendKeys(process.env.LINKEDIN_PASS);

            browser.driver.findElement(by.css('[name="authorize"]'))
                .click();

            util.switch_to(0);
        }
    },

    navigation: {
        home: () =>
            browser.get('http://localhost:3000/'),

        company: guid =>
            browser.get('http://localhost:3000/company/' + (guid ? guid : '')),
    }
};
