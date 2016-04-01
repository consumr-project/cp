"use strict";
var utils_1 = require('../utils');
var Type = require('sequelize/lib/data-types');
module.exports = function (sequelize) {
    var User = require('./user')(sequelize), Review = require('./review')(sequelize);
    var UserReport = sequelize.define('user_report', utils_1.merge(utils_1.TRACKING(), {
        id: {
            type: Type.UUID,
            primaryKey: true
        },
        user_id: {
            type: Type.UUID,
            allowNull: false
        },
        review_id: {
            type: Type.UUID,
            allowNull: true
        },
        summary: {
            type: Type.TEXT
        }
    }), utils_1.CONFIG);
    UserReport.belongsTo(User);
    UserReport.belongsTo(Review);
    return UserReport;
};
