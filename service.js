'use strict';

require('newrelic');

var email, rabbitmq;

var emails = require('./src/email');

var Transport = require('nodemailer').createTransport,
    smtpPool = require('nodemailer-smtp-pool'),
    amqp = require('amqp');

var config = require('acm'),
    debug = require('debug'),
    log = debug('service');

// rabbitmq = amqp.createConnection({ host: config('amqp.host') });
// rabbitmq.on('ready', function () {
//     rabbitmq.queue(config('amqp.queues.emails'), {
//         durable: true,
//         autoDelete: false
//     }, function (q) {
//         q.subscribe(function (message) {
//             console.log(message);
//         });
//     });
//
//     setInterval(function () {
//         emails.queue(rabbitmq, '361767ad09b5d573f6fb701f198e218d', 'welcome');
//     }, 20);
// });

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

var Message = require('./src/message');
var message = new Message({
    type: Message.TYPE.EMAIL,
    subject: 'welcome',
    payload: {
        email: 'minond.marcos@gmail.com',
        name: 'Marcos',
        lang: 'en'
    }
});

emails.send(email, message, function (err, info) {
    console.log(err);
    console.log(info);
    process.exit(0);
});
