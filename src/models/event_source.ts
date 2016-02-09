import { CONFIG, TRACKING, merge } from '../utils';
import { DataTypes } from 'sequelize';

const Type: DataTypes = require('sequelize/lib/data-types');

export = sequelize => {
    var Event = require('./event')(sequelize);

    var EventSource = sequelize.define('event_source', merge(TRACKING, {
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
    }), CONFIG);

    EventSource.belongsTo(Event);

    return EventSource;
};
