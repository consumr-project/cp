import { Config, Type, merge /* tracking */ } from '../utils';
import { DbmsDevice } from '../../device/dbms';
import { UUID } from '../../lang';
import { Message, IdentifiableMessage, StampedMessage } from '../message';

import gen_event from './event';
import gen_tag from './tag';

export interface EventTagMessage extends IdentifiableMessage, StampedMessage {
    event_id: UUID;
    tag_id: UUID;
}

export default (device: DbmsDevice) => {
    var Event = gen_event(device),
        Tag = gen_tag(device);

    var EventTag = device.define<Message & EventTagMessage, EventTagMessage>('event_tag', merge({
        event_id: {
            type: Type.UUID,
            allowNull: false
        },

        tag_id: {
            type: Type.UUID,
            allowNull: false
        }
    }), Config);

    Event.belongsToMany(Tag, { through: EventTag });
    Tag.belongsToMany(Event, { through: EventTag });

    return EventTag;
};
