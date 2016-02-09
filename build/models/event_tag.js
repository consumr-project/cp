"use strict";
var utils_1 = require('../utils');
var Type = require('sequelize/lib/data-types');
module.exports = function (sequelize) {
    var Event = require('./event')(sequelize), Tag = require('./tag')(sequelize);
    var EventTag = sequelize.define('event_tag', utils_1.merge({
        event_id: {
            type: Type.UUID,
            allowNull: false
        },
        tag_id: {
            type: Type.UUID,
            allowNull: false
        }
    }), utils_1.CONFIG);
    Event.belongsToMany(Tag, { through: EventTag });
    Tag.belongsToMany(Event, { through: EventTag });
    return EventTag;
};
