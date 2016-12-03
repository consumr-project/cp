import { Config, Type, merge /* tracking */ } from '../utils';
import { DbmsDevice } from '../../device/dbms';
import { UUID } from '../../lang';
import { Message, IdentifiableMessage, StampedMessage } from '../message';

import gen_user from './user';
import gen_event from './event';

export interface EventBookmarkMessage extends IdentifiableMessage, StampedMessage {
    event_id: UUID;
    user_id: UUID;
}

export default (device: DbmsDevice) => {
    var User = gen_user(device),
        Event = gen_event(device);

    var EventBookmark = device.define<Message & EventBookmarkMessage, EventBookmarkMessage>('event_bookmarks', merge({
        event_id: {
            type: Type.UUID,
            allowNull: false
        },

        user_id: {
            type: Type.UUID,
            allowNull: false
        }
    }), Config);

    Event.belongsToMany(User, { through: EventBookmark });
    User.belongsToMany(Event, { through: EventBookmark });

    return EventBookmark;
};
