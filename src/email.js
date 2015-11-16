'use strict';

var KNOWN_EMAILS = ['welcome'];

var Message = require('./message'),
    config = require('acm'),
    debug = require('debug');

var log = debug('email'),
    log_error = debug('email:error');

var templates;

/**
 * loads i18n and templates
 */
function init() {
    var tmpl = require('lodash/string/template'),
        yaml = require('yamljs').parse,
        read = require('fs').readFileSync;

    if (templates) {
        return;
    }

    templates = {
        i18n: require('../build/i18n'),
        styles: yaml(read('./templates/styles.yml').toString()),
        images: yaml(read('./templates/images.yml').toString()),
        welcome: tmpl(read('./templates/welcome.tmpl'))
    };

}

/**
 * @param {amqp.Connection} connection
 * @param {String} email_to_send
 * @param {Object} payload
 */
function queue(connection, email_to_send, payload) {
    var message = new Message({
        type: Message.TYPE.EMAIL,
        subject: email_to_send,
        payload: payload
    });

    connection.publish(config('amqp.queues.emails'), message);
    log('queued email %s', message.id);
}

/**
 * @param {nodemailer.Transport} transport
 * @param {Message} message
 * @param {Function} [callback]
 */
function send(transport, message, callback) {
    var lang, subject;

    init();

    if (KNOWN_EMAILS.indexOf(message.subject) === -1) {
        callback(new Error('Invalid email: ' + message.subject));
        return;
    }

    lang = message.payload.lang || 'en';
    subject = message.subject;
    callback = callback || function () {};

    transport.sendMail({
        from: config('email.addresses.do_not_reply'),
        to: message.payload.email,
        subject: templates.i18n[lang].get('common/' + subject + '_email_subject', message.payload),
        html: templates[message.subject]({
            payload: message.payload,
            images: templates.images,
            styles: templates.styles,
            i18n: templates.i18n[lang]
        })
    }, function (err, info) {
        logStatus(message, err);
        callback(err, info);
    });
}

/**
 * @param {Message} message
 * @param {Error} [err]
 */
function logStatus(message, err) {
    if (err) {
        log_error('error sending email %s', message.id, err);
    } else {
        log('successfully sent email %s', message.id);
    }
}

module.exports.queue = queue;
module.exports.send = send;
