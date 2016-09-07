import { Transporter, createTransport as transport } from 'nodemailer';
import { SmtpPoolOptions } from 'nodemailer-smtp-pool';
import * as smtp_pool from 'nodemailer-smtp-pool';
import * as inline_base64 from 'nodemailer-plugin-inline-base64';
import { htmlToText as to_text } from 'nodemailer-html-to-text';

import { template } from 'lodash';
import { parse } from 'yamljs';
import { readFileSync as read } from 'fs';

import { EMAIL, PAYLOAD } from './notification/message';
import Message from './notification/message';
import * as config from 'acm';

const TEMPLATES = {
    base: template(asset('base.tmpl')),
    [EMAIL.WELCOME]: template(asset('welcome.tmpl')),
};

const ASSETS = {
    styles: parse(asset('styles.yml')),
    images: parse(asset('images.yml')),
};

const STRINGS = {
    en: i18n('en'),
    lolcat: i18n('en'),
};

const CONFIG: SmtpPoolOptions = {
    host: config('email.service.host'),
    maxConnections: config('email.smtp_pool.max_connections'),
    maxMessages: config('email.smtp_pool.max_messages'),
    auth: {
        user: config('email.service.user'),
        pass: config('email.service.pass'),
    },
};

function i18n(lang: string) {
    return require(`../build/i18n.${lang}`).i18n;
}

function asset(name: string) {
    return read(`${__dirname}/../assets/emails/${name}`).toString();
}

function generate_body(template: EMAIL, payload: PAYLOAD, lang: string) {
    var data = {
        body: '',
        payload: payload,
        images: ASSETS.images,
        styles: ASSETS.styles,
        i18n: STRINGS[lang] || STRINGS.en,
    };

    data.body = TEMPLATES[template](data);
    return TEMPLATES.base(data);
}

export function mailer(): Transporter {
    var mail = transport(smtp_pool(CONFIG));

    mail.use('compile', inline_base64);
    mail.use('compile', to_text());

    return mail;
}

export function send(msg: Message, transport: Transporter) {
    var html = generate_body(msg.subcategory, msg.payload, 'en');
    return html;
}

/* send(EMAIL.WELCOME, mail, msg); */
/* var mail = mailer(); */
/* mail.sendMail({ */
/*     from: 'minond.marcos@gmail.com', */
/*     to: 'minond.marcos@gmail.com', */
/*     subject: 'test ' + Math.random(), */
/*     html: '<h1>hi</h1>', */
/* }) */
/* .then(ack => console.log(ack)) */
/* .catch(err => console.error(err)); */
/* console.log(CONFIG); */
