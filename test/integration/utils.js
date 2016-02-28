'use strict';

const test = require('tape');
const superagent = require('superagent');
const config = require('acm');

const SERVICE_URL = config('test.service_url');
const AUTH_URL = config('test.auth_url');

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

test('setup', t => {
    t.plan(2);

    t.ok(SERVICE_URL, 'service url is set (process.env.TEST_SERVICE_URL)');
    t.comment(`service url: ${SERVICE_URL}`);

    t.ok(AUTH_URL, 'login url is set (process.env.TEST_AUTH_URL)');
    t.comment(`login url: ${AUTH_URL}`);

    if (!SERVICE_URL) {
        process.exit(1);
    }
});

module.exports = {
    get(path) {
        return agent.get(SERVICE_URL + path);
    },

    post(path, data) {
        return agent.post(SERVICE_URL + path, data);
    },

    put(path, data) {
        return agent.post(SERVICE_URL + path, data);
    },

    del(path) {
        return agent.delete(SERVICE_URL + path);
    },

    purge(path) {
        var query = '?purge=true&purge_key=' + process.env.CP_PURGE_KEY;
        return agent.delete(SERVICE_URL + path + query);
    },

    patch(path, data) {
        return agent.post(SERVICE_URL + path, data);
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
