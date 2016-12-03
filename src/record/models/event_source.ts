import { Config, Type, tracking, merge } from '../utils';
import { DbmsDevice } from '../../device/dbms';
import { Date2, UUID } from '../../lang';
import { Message, IdentifiableMessage, StampedMessage } from '../message';

import gen_event from './event';

export interface EventSourceMessage extends IdentifiableMessage, StampedMessage {
    event_id: UUID;
    title: string;
    url: string;
    published_date: Date2;
    summary: string;
}

export default (device: DbmsDevice) => {
    var Event = gen_event(device);

    var EventSource = device.define<Message & EventSourceMessage, EventSourceMessage>('event_source', merge(tracking(), {
        id: {
            type: Type.UUID,
            primaryKey: true
        },

        title: {
            type: Type.STRING
        },

        url: {
            type: Type.STRING,
            allowNull: false
        },

        published_date: {
            type: Type.DATE,
            allowNull: false
        },

        summary: {
            type: Type.TEXT
        }
    }), Config);

    EventSource.belongsTo(Event);

    return EventSource;
};
