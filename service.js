'use strict';

require('newrelic');

var firebase, email;

var Firebase = require('firebase'),
    Transport = require('nodemailer').createTransport;

var config = require('acm'),
    debug = require('debug'),
    log = debug('service');

var i18n = require('./build/i18n'),
    tmpl = require('lodash/string/template'),
    read = require('fs').readFileSync;

var templates = {
    welcome: tmpl(read('./templates/welcome.tmpl'))
};

firebase = new Firebase(config('firebase.url'));
email = Transport({
    service: config('email.service.name'),
    auth: {
        user: config('email.service.user'),
        pass: config('email.service.pass')
    }
});

email.sendMail({
    from: config('email.addresses.do_not_reply'),
    to: config('email.service.user'),
    subject: i18n.en.get('common/welcome_email_subject'),
    text: templates.welcome({ user: { name: 'Marcos' }, i18n: i18n.en }),
    html: templates.welcome({ user: { name: 'Marcos' }, i18n: i18n.en })
}, function (err, info) {
    console.log(err);
    console.log(info);
});
