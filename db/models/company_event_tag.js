'use strict';

var u = require('../../src/utils');

module.exports = function (sequelize, DataTypes) {
    var CompanyEvent = require('./company_event')(sequelize, DataTypes),
        Tag = require('./tag')(sequelize, DataTypes);

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

    CompanyEvent.belongsToMany(Tag, { through: CompanyEventTag });
    Tag.belongsToMany(CompanyEvent, { through: CompanyEventTag });

    return CompanyEventTag;
};
