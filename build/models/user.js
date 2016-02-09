'use strict';
var u = require('../../src/utils');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('user', u.merge(u.doneBy(DataTypes), {
        id: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING
        },
        company_name: {
            type: DataTypes.STRING
        },
        role: {
            type: DataTypes.ENUM('admin', 'user'),
            defaultValue: 'user',
            allowNull: false
        },
        lang: {
            type: DataTypes.ENUM('en'),
            defaultValue: 'en',
            allowNull: false
        },
        summary: {
            type: DataTypes.TEXT
        },
        avatar_url: {
            type: DataTypes.STRING
        },
        linkedin_url: {
            type: DataTypes.STRING
        },
        last_login_date: {
            type: DataTypes.DATE
        },
        auth_linkedin_id: {
            type: DataTypes.STRING
        }
    }), u.configuration());
};
