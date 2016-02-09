'use strict';
var u = require('../../src/utils');
module.exports = function (sequelize, DataTypes) {
    var Event = require('./event')(sequelize, DataTypes);
    var EventSource = sequelize.define('event_source', u.merge(u.doneBy(DataTypes), {
        id: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false
        },
        published_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        summary: {
            type: DataTypes.TEXT
        }
    }), u.configuration());
    EventSource.belongsTo(Event);
    return EventSource;
};
