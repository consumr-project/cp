'use strict';

require('newrelic');

var firebase, email;

var Firebase = require('firebase'),
    Transport = require('nodemailer').createTransport;

var config = require('acm'),
    debug = require('debug'),
    log = debug('service');

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
    subject: 'test ' + Math.random(),
    text: 'this is just text',
    html: '<b>hi</b>'
}, function (err, info) {
    console.log(err);
    console.log(info);
});
