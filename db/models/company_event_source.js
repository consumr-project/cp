'use strict';

var u = require('../../src/utils');

module.exports = function (sequelize, DataTypes) {
    var CompanyEvent = require('./company_event')(sequelize, DataTypes);

    var CompanyEventSource = sequelize.define('company_event_source', u.merge(u.doneBy(DataTypes), {
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
    }), u.configuration());

    CompanyEventSource.belongsTo(CompanyEvent);

    return CompanyEventSource;
};
