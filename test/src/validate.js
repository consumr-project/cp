'use strict';

const test = require('tape');
const validate = require('../../build/src/validate').default;

test('validate', t => {
    var validation, value1, value2;

    t.plan(16);

    validation = validate({
        value: () => false,
    });
    t.equal(undefined, validation.checks.value, 'starts out as undefined');
    validation.validate();

    t.equal(false, validation.checks.value, 'is updated on validate call');

    validation = validate({
        fail: () => false,
        pass: () => true,
    }, true);
    t.equal(true, validation.checks.pass, 'can run validation on creation (1)');
    t.equal(false, validation.checks.fail, 'can run validation on creation (2)');

    validation = validate({
        fail: () => false,
        pass: () => true,
    });
    validation.validate();
    t.equal(true, validation.checks.pass, 'starts with initial values (1)');
    t.equal(false, validation.checks.fail, 'starts with initial values (2)');

    validation.reset();
    t.equal(undefined, validation.checks.pass, 'removed after reset (1)');
    t.equal(undefined, validation.checks.fail, 'removed after reset (2)');

    value1 = true;
    validation = validate({
        value1: () => !!value1,
    }, true);
    t.equal(true, validation.checks.value1, 'initial check is set');

    value1 = false;
    t.equal(true, validation.checks.value1, 'external update does not change check');

    value1 = false;
    validation.validate();
    t.equal(false, validation.checks.value1, 'only calling validate function does');

    validation = validate({
        value1: () => !!value1,
        value2: () => !!value2,
    });
    value1 = true;
    value2 = true;
    t.equal(true, validation.validate(), 'passes when all options are true');

    value2 = false;
    t.equal(false, validation.validate(), 'fails when an option in false');

    value1 =  false;
    t.equal(false, validation.validate(), 'fails when all options are false');

    value2 = true;
    t.equal(false, validation.validate(), 'still failing');

    value1 =  true;
    t.equal(true, validation.validate(), 'now all options are true and it passes');
});
