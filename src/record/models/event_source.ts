import { Config, Type, tracking, merge } from '../utils';

export = sequelize => {
    var Event = require('./event')(sequelize);

    var EventSource = sequelize.define('event_source', merge(tracking(), {
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
