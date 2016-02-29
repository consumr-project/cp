"use strict";
var utils_1 = require('../utils');
var Type = require('sequelize/lib/data-types');
module.exports = function (sequelize) {
    var User = require('./user')(sequelize), Event = require('./event')(sequelize);
    var EventBookmark = sequelize.define('event_bookmarks', utils_1.merge({
        event_id: {
            type: Type.UUID,
            allowNull: false
        },
        user_id: {
            type: Type.UUID,
            allowNull: false
        }
    }), utils_1.CONFIG);
    Event.belongsToMany(User, { through: EventBookmark });
    User.belongsToMany(Event, { through: EventBookmark });
    return EventBookmark;
};
