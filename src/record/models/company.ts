import { CONFIG, TRACKING, merge } from '../utils';
import { DataTypes } from 'sequelize';

const Type: DataTypes = require('sequelize/lib/data-types');

export = sequelize =>
    sequelize.define('company', merge(TRACKING(), {
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
        },

        twitter_handle: {
            type: Type.TEXT
        },
    }), CONFIG);
