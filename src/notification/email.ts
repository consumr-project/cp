import { Transporter, SentMessageInfo,
    createTransport as transport } from 'nodemailer';

import { SmtpPoolOptions } from 'nodemailer-smtp-pool';
import * as smtp_pool from 'nodemailer-smtp-pool';
import * as inline_base64 from 'nodemailer-plugin-inline-base64';
import { htmlToText as to_text } from 'nodemailer-html-to-text';

import { template } from 'lodash';
import { parse } from 'yamljs';
import { readFileSync as read } from 'fs';

import { pick_i18n } from '../strings';
import { EMAIL, PAYLOAD, CATEGORY } from './message';
import Message from './message';
import * as config from 'acm';

const ADDRESS_DO_NOT_REPLAY = config('email.addresses.do_not_reply');

const TEMPLATES = {
    base: template(asset('base.tmpl')),
    [EMAIL.WELCOME]: template(asset('welcome.tmpl')),
};

const ASSETS = {
    styles: parse(asset('styles.yml')),
    images: parse(asset('images.yml')),
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

const TRANSPORT = mailer();

function asset(name: string) {
    return read(`${__dirname}/../../assets/emails/${name}`).toString();
}

function generate_subject(template: EMAIL, payload: PAYLOAD, lang: string) {
    var name = template.toString().toLowerCase();
    return pick_i18n(lang).get(`emails/${name}_email_subject`, payload);
}

function generate_body(template: EMAIL, payload: PAYLOAD, lang: string) {
    var data = {
        body: '',
        payload: payload,
        images: ASSETS.images,
        styles: ASSETS.styles,
        i18n: pick_i18n(lang),
        config: {
            url: config('cp.url'),
        }
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

export function send(transport: Transporter, msg: Message, lang: string = ''): Promise<SentMessageInfo> {
    var html = generate_body(msg.subcategory, msg.payload, lang);
    var subject = generate_subject(msg.subcategory, msg.payload, lang);

    return transport.sendMail({
        from: ADDRESS_DO_NOT_REPLAY,
        to: msg.to,
        subject,
        html,
    });
}

export namespace send {
    export function welcome(to: string, name: string, lang: string = '') {
        return send(TRANSPORT, new Message(CATEGORY.EMAIL, EMAIL.WELCOME, to, { name }), lang);
    }
}
