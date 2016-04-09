'use strict';

const tape = require('tape');
const tapes = require('tapes');
const superagent = require('superagent');
const config = require('acm');

const cli_helper = require('../../scripts/cli.js');

const SERVICE_URL = config('test.service_url') || '';
const AUTH_URL = config('test.auth_url') || '';
const CP_PURGE_KEY = process.env.CP_PURGE_KEY || '';

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

    cli_helper.cp_ascii(console.log);

    t.comment(`service url: "${SERVICE_URL}"`);
    t.comment(`login url: "${AUTH_URL}"`);
    t.comment(`purge key: "${CP_PURGE_KEY}"`);
    t.comment('');

    t.ok(SERVICE_URL, 'service url is set (process.env.TEST_SERVICE_URL)');

    if (!SERVICE_URL) {
        process.exit(1);
    }
});

module.exports = {
    tape, tapes, agent,

    get(path) {
        return agent.get(SERVICE_URL + path);
    },

    post(path, data) {
        return agent.post(SERVICE_URL + path, data);
    },

    put(path, data) {
        return agent.put(SERVICE_URL + path, data);
    },

    del(path) {
        return agent.delete(SERVICE_URL + path);
    },

    purge(path) {
        var query = '?purge=true&purge_key=' + CP_PURGE_KEY;
        return agent.delete(SERVICE_URL + path + query);
    },

    patch(path, data) {
        return agent.patch(SERVICE_URL + path).send(data);
    },

    login(apikey) {
        return agent.post(AUTH_URL + '/key', { apikey });
    },

    logout() {
        return agent.get(AUTH_URL + '/logout');
    },

    user() {
        return agent.get(AUTH_URL + '/user');
    },
};

/**
 * @param {Tape} t
 * @param {Error} [err]
 * @param {Response} res
 * @return {void}
 */
module.exports.rescheck = function (t, err, res) {
    t.error(err);
    t.equal(200, res.status);
    t.ok(res.body.body, 'has a service response body');
    t.ok(res.body.meta, 'has service response metadata');
};
