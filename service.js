'use strict';

require('newrelic');

var firebase, email;

var Firebase = require('firebase'),
    Transport = require('nodemailer').createTransport;

var config = require('acm'),
    debug = require('debug'),
    log = debug('service');

var i18n = require('./build/i18n');

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
    subject: i18n.get('en/common/welcome_email_subject'),
    text: i18n.get('en/common/welcome_email_text', {name: 'Marcos'}),
    html: i18n.get('en/common/welcome_email_text', {name: 'Marcos'})
}, function (err, info) {
    console.log(err);
    console.log(info);
});
