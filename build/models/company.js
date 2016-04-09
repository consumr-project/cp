"use strict";
var utils_1 = require('../utils');
var Type = require('sequelize/lib/data-types');
module.exports = function (sequelize) {
    return sequelize.define('company', utils_1.merge(utils_1.TRACKING(), {
        id: {
            type: Type.UUID,
            primaryKey: true
        },
        guid: {
            type: Type.STRING,
            unique: true
        },
        name: {
            type: Type.STRING,
            allowNull: false
        },
        summary: {
            type: Type.TEXT
        },
        wikipedia_url: {
            type: Type.TEXT
        },
        website_url: {
            type: Type.TEXT
        }
    }), utils_1.CONFIG);
};
