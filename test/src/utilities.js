'use strict';

const test = require('tape');
const utilities = require('../../build/utilities');

test('utilities', t => {
    t.plan(3);

    var callbacks = [
        () => 1,
        () => 0,
    ];

    t.equal(1,
        utilities.ternary(true, ...callbacks),
        'returns true path');

    t.equal(0,
        utilities.ternary(false, ...callbacks),
        'returns false path');

    t.equal(undefined,
        utilities.ternary(false, callbacks[0]),
        'no false path required');
});
