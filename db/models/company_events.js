'use strict';

var u = require('../../src/utils');

module.exports = function (sequelize, DataTypes) {
    var Event = require('./event')(sequelize, DataTypes),
        Company = require('./company')(sequelize, DataTypes);

    var CompanyEvent = sequelize.define('company_event', u.merge({
        company_id: {
            type: DataTypes.UUID,
            allowNull: false
        },

        event_id: {
            type: DataTypes.UUID,
            allowNull: false
        }
    }), u.configuration());

    Company.belongsToMany(Event, { through: CompanyEvent });
    Event.belongsToMany(Company, { through: CompanyEvent });

    return CompanyEvent;
};
