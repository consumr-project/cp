import { CONFIG, TRACKING, merge } from '../utils';
import { DataTypes } from 'sequelize';

const Type: DataTypes = require('sequelize/lib/data-types');

export = sequelize =>
    sequelize.define('allowed_email', merge(TRACKING(), {
        email: {
            type: Type.STRING,
            allowNull: false,
            primaryKey: true
        }
    }), CONFIG);
