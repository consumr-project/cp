import { Config, Type, merge /* tracking */ } from '../utils';
import gen_user from './user';
import gen_event from './event';

export = sequelize => {
    var User = gen_user(sequelize),
        Event = gen_event(sequelize);

    var EventBookmark = sequelize.define('event_bookmarks', merge({
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
