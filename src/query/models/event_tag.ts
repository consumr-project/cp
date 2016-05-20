import { CONFIG, TRACKING, merge } from '../utils';
import { DataTypes } from 'sequelize';

const Type: DataTypes = require('sequelize/lib/data-types');

export = sequelize => {
    var Event = require('./event')(sequelize),
        Tag = require('./tag')(sequelize);

    var EventTag = sequelize.define('event_tag', merge(TRACKING(), {
        event_id: {
            type: Type.UUID,
            allowNull: false
        },

        tag_id: {
            type: Type.UUID,
            allowNull: false
        }
    }), CONFIG);

    Event.belongsToMany(Tag, { through: EventTag });
    Tag.belongsToMany(Event, { through: EventTag });

    return EventTag;
};
