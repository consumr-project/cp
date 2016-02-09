"use strict";
var utils_1 = require('../utils');
var Type = require('sequelize/lib/data-types');
module.exports = function (sequelize) {
    return sequelize.define('product', utils_1.merge(utils_1.TRACKING(), {
        id: {
            type: Type.UUID,
            primaryKey: true
        },
        approved: {
            type: Type.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        'en-US': {
            type: Type.STRING,
            allowNull: false
        }
    }), utils_1.CONFIG);
};
