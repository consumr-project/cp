'use strict';

const SERVICE_URL = process.env.SERVICE_URL;

const test = require('tape');
const superagent = require('superagent');

test('setup', t => {
    t.plan(1);
    t.ok(SERVICE_URL, 'service url is set');
    t.comment(`service url: ${SERVICE_URL}`);

    if (!SERVICE_URL) {
        process.exit(1);
    }
});

module.exports = {
    get(path) {
        return superagent.get(SERVICE_URL + path);
    }
};
