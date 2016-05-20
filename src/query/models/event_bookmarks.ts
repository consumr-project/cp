import { CONFIG, TRACKING, merge } from '../utils';
import { DataTypes } from 'sequelize';

const Type: DataTypes = require('sequelize/lib/data-types');

export = sequelize => {
    var User = require('./user')(sequelize),
        Event = require('./event')(sequelize);

    var EventBookmark = sequelize.define('event_bookmarks', merge(TRACKING(), {
        event_id: {
            type: Type.UUID,
            allowNull: false
        },

        user_id: {
            type: Type.UUID,
            allowNull: false
        }
    }), CONFIG);

    Event.belongsToMany(User, { through: EventBookmark });
    User.belongsToMany(Event, { through: EventBookmark });

    return EventBookmark;
};
