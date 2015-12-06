'use strict';

var u = require('../../src/utils');

module.exports = function (sequelize, DataTypes) {
    var User = require('./user')(sequelize, DataTypes);

    var Company = sequelize.define('company', u.merge(u.doneBy(DataTypes), {
        id: {
            type: DataTypes.UUID,
            primaryKey: true
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false
        },

        summary: {
            type: DataTypes.TEXT
        }
    }), u.configuration());

    Company.belongsToMany(User, { through: 'company_followers' });
    User.belongsToMany(Company, { through: 'company_followers' });

    return Company;
};
