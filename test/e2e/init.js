'use strict';

/* global browser, element, by */
var wait = global.wait = ms =>
    browser.sleep(ms || 100);

var $ = global.$ = selector =>
    element.all(by.css(selector)).first();

var admin = global.admin = {
    login: () => {
        navigation.home();

        $('[i18n="admin/sing_in_or_up"]').click();
        $('[i18n="admin/sing_in_with_service"]').click();
        $('[i18n="admin/remind_later"]').click();

        wait();
        switch_to(1);
        wait();

        browser.driver.findElement(by.id('session_key-oauth2SAuthorizeForm'))
            .sendKeys(admin.login.user.email);

        browser.driver.findElement(by.id('session_password-oauth2SAuthorizeForm'))
            .sendKeys(admin.login.user.pass());

        browser.driver.findElement(by.css('[name="authorize"]'))
            .click();

        switch_to(0);
    }
};

admin.login.user = require('../../config/protractor.js').config.user;

var navigation = global.navigation = {
    home: () =>
        browser.get('http://localhost:3000/'),

    company: guid =>
        browser.get('http://localhost:3000/company/' + (guid ? guid : '')),
};

var switch_to = global.switch_to = index =>
    browser.getAllWindowHandles().then(handles =>
        browser.switchTo().window(handles[index]));
