import { Config, Type, tracking, merge } from '../utils';

export = sequelize =>
    sequelize.define('beta_email_invite', merge(tracking(), {
        email: {
            type: Type.STRING,
            allowNull: false,
            primaryKey: true
        },

        approved: {
            type: Type.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },

        approved_by: {
            type: Type.UUID,
            allowNull: true,
        },

        approved_date: {
            type: Type.DATE,
            allowNull: true,
        },
    }), Config);
