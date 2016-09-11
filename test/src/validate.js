'use strict';

const test = require('tape');
const validate = require('../../build/src/validate').default;

test('validate', t => {
    t.plan(2);

    var validation = validate({
        value: () => false,
    });

    t.comment('starts out as undefined');
    t.equal(undefined, validation.checks.value);

    validation.validate();
    t.comment('is updated on validate call');
    t.equal(false, validation.checks.value);
});

test('validate', t => {
    t.plan(2);

    var validation = validate({
        fail: () => false,
        pass: () => true,
    }, true);

    t.comment('can run validation on creation');
    t.equal(true, validation.checks.pass);
    t.equal(false, validation.checks.fail);
});

test('validate', t => {
    t.plan(4);

    var validation = validate({
        fail: () => false,
        pass: () => true,
    });

    validation.validate();
    t.comment('starts with initial values');
    t.equal(true, validation.checks.pass);
    t.equal(false, validation.checks.fail);

    validation.reset();
    t.comment('removed after reset');
    t.equal(undefined, validation.checks.pass);
    t.equal(undefined, validation.checks.fail);
});

test('validate', t => {
    t.plan(3);

    var value = true;

    var validation = validate({
        value: () => !!value,
    }, true);

    t.comment('initial check is set');
    t.equal(true, validation.checks.value);

    value = false;
    t.comment('external update does not change check');
    t.equal(true, validation.checks.value);

    value = false;
    validation.validate();
    t.comment('only calling validate function does');
    t.equal(false, validation.checks.value);
});
