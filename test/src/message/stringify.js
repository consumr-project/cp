'use strict';

const test = require('tape');
const I18n = require('../utils/i18n');

const Message = require('../../../build/src/notification/message').default;
const stringify = require('../../../build/src/client/services/messages').stringify;

const MTYPE = require('../../../build/src/notification/message').TYPE;
const NTYPE = require('../../../build/src/notification/notification').TYPE;

const i18n = new I18n({
    'notification/followed_by_one': '<b>{name}</b> started following you.',
});

test('message stringify', t => {
    t.plan(1);
    t.equal('<b>Marcos Minond</b> started following you.', stringify(i18n, [
        new Message({ type: MTYPE.NOTIFICATION, payload: {
            type: NTYPE.FOLLOWED,
            name: 'Marcos Minond',
        }})
    ]));
});
