import { filter, get, reduce, groupBy as group_by } from 'lodash';
import { I18n } from '../../strings';

import Message, { MessagePresentation, NOTIFICATION, OTYPE } from '../../notification/message';

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

function stringify_favorited(i18n: I18n, messages: Message[]): string {
    var fields = {
        name: striptags(get<string>(messages, '0.payload.name')),
        other: striptags(get<string>(messages, '1.payload.name')),
        event: striptags(get<string>(messages, '0.payload.obj_name')),
        count: messages.length - 1,
    };

    switch (messages.length) {
        case 1: return i18n.get('notification/favorited_by_one', fields);
        case 2: return i18n.get('notification/favorited_by_two', fields);
        default: return i18n.get('notification/favorited_by_many', fields);
    }
}

function stringify_modified(i18n: I18n, messages: Message[]): string {
    var fields = {
        name: striptags(get<string>(messages, '0.payload.name')),
        other: striptags(get<string>(messages, '1.payload.name')),
        event: striptags(get<string>(messages, '0.payload.obj_name')),
        count: messages.length - 1,
    };

    switch (messages.length) {
        case 1: return i18n.get('notification/modified_by_one', fields);
        case 2: return i18n.get('notification/modified_by_two', fields);
        default: return i18n.get('notification/modified_by_many', fields);
    }
}

function stringify_contributed(i18n: I18n, messages: Message[]): string {
    var fields = {
        name: striptags(get<string>(messages, '0.payload.name')),
        other: striptags(get<string>(messages, '1.payload.name')),
        event: striptags(get<string>(messages, '0.payload.obj_name')),
        count: messages.length - 1,
    };

    switch (messages.length) {
        case 1: return i18n.get('notification/contributed_by_one', fields);
        case 2: return i18n.get('notification/contributed_by_two', fields);
        default: return i18n.get('notification/contributed_by_many', fields);
    }
}

export function stringify(i18n: I18n, messages: Message[]): string {
    switch (messages[0].subcategory) {
        case NOTIFICATION.CONTRIBUTED: return stringify_contributed(i18n, messages);
        case NOTIFICATION.FAVORITED: return stringify_favorited(i18n, messages);
        case NOTIFICATION.FOLLOWED: return stringify_followed(i18n, messages);
        case NOTIFICATION.MODIFIED: return stringify_modified(i18n, messages);
        default: return '';
    }
}

export function link(message: Message): string {
    var payload = message.payload;
    var otype;

    switch (payload.p_obj_otype) {
        case OTYPE.COMPANY:
            otype = 'company';
            break;

        case OTYPE.TAG:
            otype = 'tag';
            break;
    }

    switch (message.subcategory) {
        case NOTIFICATION.CONTRIBUTED: return `/${otype}/id/${payload.p_obj_id}/event/${payload.obj_id}`;
        case NOTIFICATION.FAVORITED: return `/${otype}/id/${payload.p_obj_id}/event/${payload.obj_id}`;
        case NOTIFICATION.FOLLOWED: return '/user/me/followers/users';
        case NOTIFICATION.MODIFIED: return `/${otype}/id/${payload.p_obj_id}/event/${payload.obj_id}`;
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
            message.payload.obj_id || '0',
        ].join('-');
    });

    var labels = Object.keys(groups).sort().reverse();

    return reduce(labels, (store, label) => {
        store[store.length] = groups[label];
        return store;
    }, []);
}

export function condence(i18n: I18n, messages: Message[]): MessagePresentation {
    return {
        subcategory: messages[0].subcategory,
        date: messages[0].date,
        user_id: messages[0].payload.id,
        html: stringify(i18n, messages),
        messages: messages,
        is_completed: !filter(messages, { completed: false }).length,
        href: link(messages[0]),
    };
}

export function prep(i18n: I18n, messages: Message[]): MessagePresentation[] {
    return group(messages).map(group => condence(i18n, group));
}
