import { CONFIG, TRACKING, merge } from '../utils';
import { DataTypes } from 'sequelize';

const Type: DataTypes = require('sequelize/lib/data-types');

export = sequelize =>
    sequelize.define('user', merge(TRACKING(), {
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
        },

        auth_apikey: {
            type: Type.STRING
        }
    }), CONFIG);
