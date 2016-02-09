"use strict";
var utils_1 = require('../utils');
var Type = require('sequelize/lib/data-types');
module.exports = function (sequelize) {
    var User = require('./user')(sequelize), Company = require('./company')(sequelize);
    var CompanyFollower = sequelize.define('company_follower', utils_1.merge({
        company_id: {
            type: Type.UUID,
            allowNull: false
        },
        user_id: {
            type: Type.UUID,
            allowNull: false
        }
    }), utils_1.CONFIG);
    Company.belongsToMany(User, { through: CompanyFollower });
    User.belongsToMany(Company, { through: CompanyFollower });
    return CompanyFollower;
};
