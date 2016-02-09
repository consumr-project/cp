'use strict';
var u = require('../../src/utils');
module.exports = function (sequelize, DataTypes) {
    var Event = require('./event')(sequelize, DataTypes), Tag = require('./tag')(sequelize, DataTypes);
    var EventTag = sequelize.define('event_tag', u.merge({
        event_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        tag_id: {
            type: DataTypes.UUID,
            allowNull: false
        }
    }), u.configuration());
    Event.belongsToMany(Tag, { through: EventTag });
    Tag.belongsToMany(Event, { through: EventTag });
    return EventTag;
};
