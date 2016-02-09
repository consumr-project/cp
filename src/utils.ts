import { merge as lmerge } from 'lodash';
import { DataTypes } from 'sequelize';

const Type: DataTypes = require('sequelize/lib/data-types');

export function merge(...args: Object[]): Object {
    return lmerge.apply(null, args.reverse());
}

export const CONFIG: Object = {
    underscored: true,
    paranoid: true,
    deletedAt: 'deleted_date',
    createdAt: 'created_date',
    updatedAt: 'updated_date',
};

export const TRACKING = () => {
    return {
        created_by: {
            type: Type.UUID,
            allowNull: false,
        },

        updated_by: {
            type: Type.UUID,
            allowNull: false,
        },

        deleted_by: {
            type: Type.UUID,
        },
    };
};

// XXX
export function configuration(): Object {
    return {
        underscored: true,
        paranoid: true,
        deletedAt: 'deleted_date',
        createdAt: 'created_date',
        updatedAt: 'updated_date'
    };
}

// XXX
export function doneBy(): Object {
    return {
        created_by: {
            type: Type.UUID,
            allowNull: false
        },

        updated_by: {
            type: Type.UUID,
            allowNull: false,
        },

        deleted_by: {
            type: Type.UUID
        }
    };
}
