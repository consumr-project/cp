import { CONFIG, TRACKING, merge } from '../utils';
import { DataTypes } from 'sequelize';

const Type: DataTypes = require('sequelize/lib/data-types');

export = sequelize =>
    sequelize.define('token', merge(TRACKING(), {
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
    }), CONFIG);
