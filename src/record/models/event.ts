import { Config, Type, tracking, merge } from '../utils';

export = sequelize =>
    sequelize.define('event', merge(tracking(), {
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
    }), Config);
