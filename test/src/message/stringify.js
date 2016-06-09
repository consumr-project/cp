'use strict';

const test = require('tape');

const Message = require('../../../build/src/notification/message').default;
const stringify = require('../../../build/src/client/services/messages').stringify;

const MTYPE = require('../../../build/src/notification/message').TYPE;
const NTYPE = require('../../../build/src/notification/notification').TYPE;

test('message stringify', t => {
    t.plan(1);
    t.equal('Marcos Minond started following you', stringify([
        new Message({ type: MTYPE.NOTIFICATION, payload: {
            type: NTYPE.FOLLOWED,
            name: 'Marcos Minond',
        }})
    ]));
});
