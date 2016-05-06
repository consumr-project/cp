// 'use strict';
//
// const Message = require('./message');
// const config = require('acm');
// const debug = require('debug');
//
// const tmpl = require('lodash/template');
// const yaml = require('yamljs').parse;
// const read = require('fs').readFileSync;
//
// const TYPE = {
//     WELCOME: 'WELCOME'
// };
//
// const TEMPLATES = {
//     i18n: require('../build/i18n'),
//     styles: yaml(read('./assets/emails/styles.yml').toString()),
//     images: yaml(read('./assets/emails/images.yml').toString()),
//
//     base: tmpl(read('./assets/emails/base.tmpl')),
//     welcome: tmpl(read('./assets/emails/welcome.tmpl'))
// };
//
// var log = debug('service:notification:email');
//
// /**
//  * @param {amqp.Connection} connection
//  * @param {String} email_to_send
//  * @param {Object} payload
//  */
// function queue(connection, email_to_send, payload) {
//     var message = new Message({
//         type: Message.TYPE.EMAIL,
//         subject: email_to_send,
//         payload
//     });
//
//     connection.publish(config('amqp.queues.emails'), message);
//     log('queued email %s', message.id);
// }
//
// /**
//  * @param {Message} message
//  * @return {Error|null}
//  */
// function validate(message) {
//     if (!message.subject) {
//         return new Error('a message subject is required to send emails');
//     } else if (!(message.subject in TYPE)) {
//         return new Error(`invalid email: ${message.subject}`);
//     } else if (!message.payload) {
//         return new Error('an email payload is required');
//     } else if (!message.payload.email) {
//         return new Error('an email address is required');
//     }
// }
//
// /**
//  * @param {nodemailer.Transport} transport
//  * @param {Message} message
//  * @param {Function} [cb]
//  */
// function send(transport, message, cb) {
//     var html, from, to;
//
//     var lang = message.payload.lang || 'en',
//         subject = message.subject,
//         callback = cb || function () {};
//
//     var template_data = {
//         payload: message.payload,
//         images: TEMPLATES.images,
//         styles: TEMPLATES.styles,
//         i18n: TEMPLATES.i18n[lang]
//     };
//
//     if (validate(message)) {
//         log(validate(message));
//         callback(validate(message));
//         return;
//     }
//
//     subject = subject.toLowerCase();
//     template_data.body = TEMPLATES[subject](template_data);
//     html = TEMPLATES.base(template_data);
//
//     from = config('email.addresses.do_not_reply');
//     to = message.payload.email;
//     subject = TEMPLATES.i18n[lang].get(`common/${subject}_email_subject`, message.payload);
//
//     transport.sendMail({ from, to, subject, html }, (err, info) => {
//         log_status(message, err);
//         callback(err, info);
//     });
// }
//
// /**
//  * @param {Message} message
//  * @param {Error} [err]
//  */
// function log_status(message, err) {
//     return err ? log('error sending email %s', message.id, err) :
//         log('successfully sent email %s', message.id);
// }
//
// module.exports.TYPE = TYPE;
//
// module.exports.queue = queue;
// module.exports.send = send;
