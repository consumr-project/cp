"use strict";
var utils_1 = require('../utils');
var Type = require('sequelize/lib/data-types');
module.exports = function (sequelize) {
    var User = require('./user')(sequelize), Review = require('./review')(sequelize);
    var ReviewUsefulness = sequelize.define('review_usefulness', utils_1.merge(utils_1.TRACKING(), {
        review_id: {
            type: Type.UUID,
            allowNull: false
        },
        user_id: {
            type: Type.UUID,
            allowNull: false
        },
        score: {
            type: Type.INTEGER,
            allowNull: false
        }
    }), utils_1.CONFIG);
    User.belongsToMany(Review, { through: ReviewUsefulness });
    Review.belongsToMany(User, { through: ReviewUsefulness });
    return ReviewUsefulness;
};
