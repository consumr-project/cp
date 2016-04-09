"use strict";
var utils_1 = require('../utils');
var Type = require('sequelize/lib/data-types');
module.exports = function (sequelize) {
    return sequelize.define('event', utils_1.merge(utils_1.TRACKING(), {
        id: {
            type: Type.UUID,
            primaryKey: true
        },
        title: {
            type: Type.STRING,
            allowNull: false
        },
        date: {
            type: Type.DATE,
            allowNull: false
        },
        logo: {
            type: Type.STRING,
            allowNull: false
        },
        sentiment: {
            type: Type.ENUM('positive', 'negative', 'neutral'),
            allowNull: false
        }
    }), utils_1.CONFIG);
};
