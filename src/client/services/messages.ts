import { get } from 'lodash';
import { I18n } from 'cp/client';

import { TYPE } from '../../notification/notification';
import Message from '../../notification/message';

function stringify_followed(i18n: I18n, messages: Message[]): string {
    var fields = {
        name: get(messages, '0.payload.name'),
        other: get(messages, '1.payload.name'),
        count: messages.length - 1,
    };

    switch (messages.length) {
    case 1: return i18n.get('notification/followed_by_one', fields);
    case 2: return i18n.get('notification/followed_by_two', fields);
    default: return i18n.get('notification/followed_by_many', fields);
    }
}

export function stringify(i18n: I18n, messages: Message[]): string {
    switch (messages[0].payload.type) {
    case TYPE.FOLLOWED: return stringify_followed(i18n, messages);
    default: return '';
    }
}
