import { Config, Type, merge /* tracking */ } from '../utils';

export = sequelize => {
    var Event = require('./event')(sequelize),
        Tag = require('./tag')(sequelize);

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
