'use strict';

var u = require('../src/utils');

module.exports = function (sequelize, DataTypes) {
    var Tag = require('./tag')(sequelize, DataTypes);
    var Event = sequelize.define('event', u.merge(u.doneBy(DataTypes), {
        id: {
            type: DataTypes.UUID,
            primaryKey: true
        },

        title: {
            type: DataTypes.STRING,
            allowNull: false
        },

        sentiment: {
            type: DataTypes.ENUM('positive', 'negative', 'neutral'),
            allowNull: false
        }
    }), u.configuration());

    Event.belongsToMany(Tag, { through: 'event_tags' });
    Tag.belongsToMany(Event, { through: 'event_tags' });

    return Event;
};
