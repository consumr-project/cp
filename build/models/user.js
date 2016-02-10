"use strict";
var utils_1 = require('../utils');
var Type = require('sequelize/lib/data-types');
module.exports = function (sequelize) {
    return sequelize.define('user', utils_1.merge(utils_1.TRACKING(), {
        id: {
            type: Type.UUID,
            primaryKey: true
        },
        name: {
            type: Type.STRING,
            allowNull: false
        },
        email: {
            type: Type.STRING,
            allowNull: false
        },
        title: {
            type: Type.STRING
        },
        company_name: {
            type: Type.STRING
        },
        role: {
            type: Type.ENUM('admin', 'user'),
            defaultValue: 'user',
            allowNull: false
        },
        lang: {
            type: Type.ENUM('en'),
            defaultValue: 'en',
            allowNull: false
        },
        summary: {
            type: Type.TEXT
        },
        avatar_url: {
            type: Type.STRING
        },
        linkedin_url: {
            type: Type.STRING
        },
        last_login_date: {
            type: Type.DATE
        },
        auth_linkedin_id: {
            type: Type.STRING
        }
    }), utils_1.CONFIG);
};
