'use strict';

process.env.LOG_LEVEL = 'debug';

const config = require('acm');
const logger = require('../../build/log').logger;
const MailParser = require('mailparser').MailParser;
const Server = require('smtp-server').SMTPServer;
const express = require('express');

const SMTP_PORT = config('mock.smtp.smtp.port');
const HTTP_PORT = config('mock.smtp.http.port');

/* jshint newcap: false, supernew: true */
const INBOX = new class {
    constructor() {
        this.mem = {};
    }

    store(email) {
        var addr = email.to[0].address;
        this.mem[addr] = this.mem[addr] || [];
        this.mem[addr].push(email);
    }
};

const http_server = express();
const smtp_server = new Server({
    authOptional: true,
    size: 1024,
    logger: logger(__filename),

    onData: (stream, session, next) =>
        stream.pipe((new MailParser()).on('end', email => {
            INBOX.store(email);
            next();
        }))
});

http_server.get('/inbox', (req, res) =>
    res.json(INBOX.mem));

http_server.delete('/inbox', (req, res) =>
    res.json(INBOX.mem = {}));

smtp_server.listen(SMTP_PORT);
http_server.listen(HTTP_PORT);
