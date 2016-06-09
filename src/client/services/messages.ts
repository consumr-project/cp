import { head } from 'lodash';

import { TYPE } from '../../notification/notification';
import Message from '../../notification/message';

function stringify_followed(messages: Message[]): string {
    switch (messages.length) {
    case 1:
        return `${messages[0].payload.name} started following you`;
    }

    return '';
}

export function stringify(messages: Message[]): string {
    var sample = head(messages);

    switch (sample.payload.type) {
    case TYPE.FOLLOWED: return stringify_followed(messages);
    }

    return '';
}
