'use strict';

const TEST_SERVICE_URL = process.env.TEST_SERVICE_URL;

const test = require('tape');
const superagent = require('superagent');

test('setup', t => {
    t.plan(1);
    t.ok(TEST_SERVICE_URL, 'service url is set (process.env.TEST_SERVICE_URL)');
    t.comment(`service url: ${TEST_SERVICE_URL}`);

    if (!TEST_SERVICE_URL) {
        process.exit(1);
    }
});

module.exports = {
    get(path) {
        return superagent.get(TEST_SERVICE_URL + path);
    }
};
