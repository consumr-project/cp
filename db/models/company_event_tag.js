'use strict';

var u = require('../../src/utils');

module.exports = function (sequelize, DataTypes) {
    var CompanyEvent = require('./company_event')(sequelize, DataTypes);

    var CompanyEventTag = sequelize.define('company_event_tag', u.merge({
        company_event_id: {
            type: DataTypes.UUID,
            allowNull: false
        },

        tag_id: {
            type: DataTypes.UUID,
            allowNull: false
        }
    }), u.configuration());

    CompanyEventTag.belongsTo(CompanyEvent);

    return CompanyEventTag;
};
