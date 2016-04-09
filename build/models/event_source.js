"use strict";
var utils_1 = require('../utils');
var Type = require('sequelize/lib/data-types');
module.exports = function (sequelize) {
    var Event = require('./event')(sequelize);
    var EventSource = sequelize.define('event_source', utils_1.merge(utils_1.TRACKING(), {
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
    }), utils_1.CONFIG);
    EventSource.belongsTo(Event);
    return EventSource;
};
