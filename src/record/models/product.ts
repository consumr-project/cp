import { Config, Type, tracking, merge } from '../utils';

export = sequelize =>
    sequelize.define('product', merge(tracking(), {
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
    }), Config);
