import { CONFIG, TRACKING, merge } from '../utils';
import { DataTypes } from 'sequelize';

const Type: DataTypes = require('sequelize/lib/data-types');

export = sequelize =>
    sequelize.define('event', merge(TRACKING(), {
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
    }), CONFIG);
