'use strict';

require('newrelic');

const Message = require('./src/message');
const Email = require('./src/email');

const amqp = require('amqp');
const create_transport = require('nodemailer').createTransport;
const create_smtp_pool = require('nodemailer-smtp-pool');

const config = require('acm');
const debug = require('debug');

const EMAIL_TRANSPORT_CONFIG = {
    service: config('email.service.name'),
    maxConnections: config('email.smtp_pool.max_connections'),
    maxMessages: config('email.smtp_pool.max_messages'),
    rateLimit: config('email.smtp_pool.rate_limit'),
    auth: {
        user: config('email.service.user'),
        pass: config('email.service.pass')
    }
};

const AMQP_CONNECTION_CONFIG = {
    host: config('amqp.host')
};

const AMQP_QUEUE_CONFIG = {
    durable: true,
    autoDelete: false
};

var email_transport = create_transport(create_smtp_pool(EMAIL_TRANSPORT_CONFIG)),
    amqp_connection = amqp.createConnection(AMQP_CONNECTION_CONFIG),
    log = debug('service:notification');

email_transport.use('compile', require('nodemailer-html-to-text').htmlToText());
email_transport.use('compile', require('nodemailer-plugin-inline-base64'));

amqp_connection.on('ready', () => {
    log('listening to %s for emails', config('amqp.queues.emails'));
    amqp_connection.queue(config('amqp.queues.emails'), AMQP_QUEUE_CONFIG, function (q) {
        q.subscribe(message =>
            Email.send(email_transport, new Message(message)));
    });

    // setInterval(function () {
    //     Email.queue(amqp_connection, Email.TYPE.WELCOME, {
    //         email: 'minond.marcos@gmail.com',
    //         name: 'Marcos',
    //         lang: 'en'
    //     });
    // }, 2000);
});

log('amqp running in %s', config('amqp.host'));
log('sending emails through %s (%s)', config('email.service.name'), config('email.service.user'));
