import { Config, Type, tracking, merge } from '../utils';

export = sequelize =>
    sequelize.define('company', merge(tracking(), {
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
    }), Config);
