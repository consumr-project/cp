'use strict';

const INSTANCE_URL = process.env.CP_TEST_INSTANCE_URL;
const CP_PURGE_KEY = process.env.CP_PURGE_KEY || '';

const tape = require('tape');
const superagent = require('superagent');

['put', 'post'].forEach(name => {
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
    t.plan(2);

    t.ok(INSTANCE_URL, `service url: "${INSTANCE_URL}"`);
    t.ok(CP_PURGE_KEY, `purge key: "${CP_PURGE_KEY}"`);

    if (!INSTANCE_URL) {
        process.exit(1);
    }
});

function create() {
    var agent = superagent.agent();

    function get(path) {
        return agent.get(INSTANCE_URL + path);
    }

    function post(path, data) {
        return agent.post(INSTANCE_URL + path, data);
    }

    function put(path, data) {
        return agent.put(INSTANCE_URL + path, data);
    }

    function del(path) {
        return agent.delete(INSTANCE_URL + path);
    }

    function purge(path) {
        var query = '?purge=true&purge_key=' + CP_PURGE_KEY;
        return agent.delete(INSTANCE_URL + path + query);
    }

    function patch(path, data) {
        return agent.patch(INSTANCE_URL + path).send(data);
    }

    return { get: get, post, put, del, purge, patch };
}

module.exports = create();
module.exports.create = create;
