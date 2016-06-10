'use strict';

const test = require('tape');
const I18n = require('../utils/i18n');

const Message = require('../../../build/src/notification/message').default;
const stringify = require('../../../build/src/client/services/messages').stringify;

const CATEGORY = require('../../../build/src/notification/message').CATEGORY;
const NOTIFICATION = require('../../../build/src/notification/message').NOTIFICATION;

const i18n = new I18n({
    'notification/followed_by_one': '{name} started following you.',
});

test('message stringify', t => {
    t.plan(1);
    t.equal('Marcos Minond started following you.', stringify(i18n, [
        new Message(CATEGORY.NOTIFICATION, NOTIFICATION.FOLLOWED,
            '1ec14c84-eb3d-41b3-b86a-3b28f2cf9853', {
                id: '1ec14c84-eb3d-41b3-b86a-3b28f2cf9853',
                otype: 'user',
                name: 'Marcos Minond',
            })
    ]));
});
