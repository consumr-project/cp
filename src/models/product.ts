import { CONFIG, TRACKING, merge } from '../utils';
import { DataTypes } from 'sequelize';

const Type: DataTypes = require('sequelize/lib/data-types');

export = sequelize =>
    sequelize.define('product', merge(TRACKING(), {
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
    }), CONFIG);
