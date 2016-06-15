import { get, reduce, groupBy as group_by } from 'lodash';
import { I18n } from 'cp/client';

import Message, { MultipleTargetPayload, NOTIFICATION } from '../../notification/message';

import striptags = require('striptags');

function stringify_followed(i18n: I18n, messages: Message[]): string {
    var fields = {
        name: striptags(get<string>(messages, '0.payload.name')),
        other: striptags(get<string>(messages, '1.payload.name')),
        count: messages.length - 1,
    };

    switch (messages.length) {
        case 1: return i18n.get('notification/followed_by_one', fields);
        case 2: return i18n.get('notification/followed_by_two', fields);
        default: return i18n.get('notification/followed_by_many', fields);
    }
}

export function stringify(i18n: I18n, messages: Message[]): string {
    switch (messages[0].subcategory) {
        case NOTIFICATION.FOLLOWED: return stringify_followed(i18n, messages);
        default: return '';
    }
}

export function link(message: Message): string {
    switch (message.subcategory) {
        case NOTIFICATION.FOLLOWED: return '/user/me/followers/users';
        default: return;
    }
}

export function group(messages: Message[]): Message[][] {
    var groups = group_by(messages, message => {
        var date = new Date(message.date.toString());

        var month = date.getMonth() + 1;
        var day = date.getDate();

        return [
            month > 9 ? month : '0' + month,
            day > 9 ? day : '0' + day,
            date.getFullYear(),
            message.category,
            message.subcategory,
            (<MultipleTargetPayload>message.payload).obj_id || '0',
        ].join('-');
    });

    var labels = Object.keys(groups).sort().reverse();

    return reduce(labels, (store, label) => {
        store[store.length] = groups[label];
        return store;
    }, []);
}
