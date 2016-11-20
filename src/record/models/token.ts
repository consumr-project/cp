import { Config, Type, tracking, merge } from '../utils';

export = sequelize =>
    sequelize.define('token', merge(tracking(), {
        id: {
            type: Type.UUID,
            primaryKey: true
        },

        token: {
            type: Type.STRING,
            allowNull: false
        },

        used: {
            type: Type.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },

        used_date: {
            type: Type.DATE,
            allowNull: true,
        },

        expiration_date: {
            type: Type.DATE,
            allowNull: false,
        },

        reason: {
            type: Type.STRING,
            allowNull: false,
        },
    }), Config);
