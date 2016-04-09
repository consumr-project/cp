'use strict';

const SERVICE_URL = process.env.TEST_SERVICE_URL;
const CP_PURGE_KEY = process.env.CP_PURGE_KEY || '';

const tape = require('tape');
const superagent = require('superagent');
const cli = require('../../../scripts/cli');

var agent = superagent.agent();

['post'].forEach(name => {
    superagent.agent.prototype[name] = function (url, data) {
        var req = superagent[name](url, data);
        req.ca(this._ca);

        req.on('response', this.saveCookies.bind(this));
        req.on('redirect', this.saveCookies.bind(this));
        req.on('redirect', this.attachCookies.bind(this, req));
        this.attachCookies(req);
        return req;
    };
});

tape('setup', t => {
    t.plan(1);

    cli.cp_ascii(console.log);

    t.comment(`service url: "${SERVICE_URL}"`);
    t.comment(`purge key: "${CP_PURGE_KEY}"`);
    t.comment('');

    t.ok(SERVICE_URL, 'service url is set (process.env.TEST_SERVICE_URL)');

    if (!SERVICE_URL) {
        process.exit(1);
    }
});

function get(path) {
    return agent.get(SERVICE_URL + path);
}

function post(path, data) {
    return agent.post(SERVICE_URL + path, data);
}

function put(path, data) {
    return agent.put(SERVICE_URL + path, data);
}

function del(path) {
    return agent.delete(SERVICE_URL + path);
}

function purge(path) {
    var query = '?purge=true&purge_key=' + CP_PURGE_KEY;
    return agent.delete(SERVICE_URL + path + query);
}

function patch(path, data) {
    return agent.patch(SERVICE_URL + path).send(data);
}

module.exports = { get: get, post, put, del, purge, patch };
