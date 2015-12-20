'use strict';

var u = require('../../src/utils');

module.exports = function (sequelize, DataTypes) {
    var User = require('./user')(sequelize, DataTypes),
        Company = require('./company')(sequelize, DataTypes);

    var CompanyFollower = sequelize.define('company_follower', u.merge({
        company_id: {
            type: DataTypes.UUID,
            allowNull: false
        },

        user_id: {
            type: DataTypes.UUID,
            allowNull: false
        }
    }), u.configuration());

    Company.belongsToMany(User, { through: CompanyFollower });
    User.belongsToMany(Company, { through: CompanyFollower });

    return CompanyFollower;
};
