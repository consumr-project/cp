"use strict";
var utils_1 = require('../utils');
var Type = require('sequelize/lib/data-types');
module.exports = function (sequelize) {
    var Event = require('./event')(sequelize), Company = require('./company')(sequelize);
    var CompanyEvent = sequelize.define('company_event', utils_1.merge({
        company_id: {
            type: Type.UUID,
            allowNull: false
        },
        event_id: {
            type: Type.UUID,
            allowNull: false
        }
    }), utils_1.CONFIG);
    Company.belongsToMany(Event, { through: CompanyEvent });
    Event.belongsToMany(Company, { through: CompanyEvent });
    return CompanyEvent;
};
