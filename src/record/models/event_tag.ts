import { Config, Type, merge /* tracking */ } from '../utils';
import { IdentifiableMessage, StampedMessage } from '../message';

import gen_event from './event';
import gen_tag from './tag';

export interface EventTagMessage extends IdentifiableMessage, StampedMessage {
    event_id: string;
    tag_id: string;
}

export default sequelize => {
    var Event = gen_event(sequelize),
        Tag = gen_tag(sequelize);

    var EventTag = sequelize.define('event_tag', merge({
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
