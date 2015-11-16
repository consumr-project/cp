'use strict';

require('newrelic');

var firebase, email;

var Firebase = require('firebase'),
    Transport = require('nodemailer').createTransport,
    smtpPool = require('nodemailer-smtp-pool');

var config = require('acm'),
    debug = require('debug'),
    log = debug('service');

var i18n = require('./build/i18n'),
    tmpl = require('lodash/string/template'),
    yaml = require('yamljs').parse,
    read = require('fs').readFileSync;

var templates = {
    styles: yaml(read('./templates/styles.yml').toString()),
    images: yaml(read('./templates/images.yml').toString()),
    welcome: tmpl(read('./templates/welcome.tmpl'))
};

firebase = new Firebase(config('firebase.url'));
email = Transport(smtpPool({
    service: config('email.service.name'),
    maxConnections: config('email.smtp_pool.max_connections'),
    maxMessages: config('email.smtp_pool.max_messages'),
    rateLimit: config('email.smtp_pool.rate_limit'),
    auth: {
        user: config('email.service.user'),
        pass: config('email.service.pass')
    }
}));

// https://github.com/werk85/node-html-to-text/blob/3773ad5ebb/README.md#options
email.use('compile', require('nodemailer-html-to-text').htmlToText());
email.use('compile', require('nodemailer-plugin-inline-base64'));

email.sendMail({
    from: config('email.addresses.do_not_reply'),
    to: config('email.service.user'),
    subject: i18n.en.get('common/welcome_email_subject'),
    html: templates.welcome({
        user: { name: 'Marcos' },
        images: templates.images,
        styles: templates.styles,
        i18n: i18n.en
    })
}, function (err, info) {
    console.log(err);
    console.log(info);
    process.exit(0);
});
