'use strict';

var u = require('../../src/utils');

module.exports = function (sequelize, DataTypes) {
    var Company = require('./company')(sequelize, DataTypes);

    var CompanyEvent = sequelize.define('company_event', u.merge(u.doneBy(DataTypes), {
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

    CompanyEvent.belongsTo(Company);

    return CompanyEvent;
};
