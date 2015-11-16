'use strict';

require('newrelic');

var email_transport, amqp_connection;

var Message = require('./src/message'),
    email = require('./src/email');

var transport = require('nodemailer').createTransport,
    smtpPool = require('nodemailer-smtp-pool'),
    amqp = require('amqp');

var config = require('acm'),
    debug = require('debug'),
    log = debug('service');

email_transport = transport(smtpPool({
    service: config('email.service.name'),
    maxConnections: config('email.smtp_pool.max_connections'),
    maxMessages: config('email.smtp_pool.max_messages'),
    rateLimit: config('email.smtp_pool.rate_limit'),
    auth: {
        user: config('email.service.user'),
        pass: config('email.service.pass')
    }
}));

email_transport.use('compile', require('nodemailer-html-to-text').htmlToText());
email_transport.use('compile', require('nodemailer-plugin-inline-base64'));

amqp_connection = amqp.createConnection({ host: config('amqp.host') });
amqp_connection.on('ready', function () {
    amqp_connection.queue(config('amqp.queues.emails'), {
        durable: true,
        autoDelete: false
    }, function (q) {
        q.subscribe(function (message) {
            email.send(email_transport, new Message(message));
        });
    });

    setInterval(function () {
        email.queue(amqp_connection, 'welcome', {
            email: 'minond.marcos@gmail.com',
            name: 'Marcos',
            lang: 'en'
        });
    }, 2000);
});

log('amqp running in %s', config('amqp.host'));
log('sending emails through %s (%s)', config('email.service.name'), config('email.service.user'));
