"use strict";
var utils_1 = require('../utils');
var Type = require('sequelize/lib/data-types');
module.exports = function (sequelize) {
    var User = require('./user')(sequelize), Company = require('./company')(sequelize);
    var Review = sequelize.define('review', utils_1.merge(utils_1.TRACKING(), {
        id: {
            type: Type.UUID,
            primaryKey: true
        },
        user_id: {
            type: Type.UUID,
            allowNull: false
        },
        company_id: {
            type: Type.UUID,
            allowNull: true
        },
        score: {
            type: Type.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
                max: 5
            }
        },
        title: {
            type: Type.STRING,
            validate: {
                len: [1, 500]
            }
        },
        summary: {
            type: Type.TEXT,
            validate: {
                len: [1, 5000]
            }
        }
    }), utils_1.CONFIG);
    Review.belongsTo(User);
    Review.belongsTo(Company);
    return Review;
};
