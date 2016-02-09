'use strict';
function merge() {
    return require('lodash/merge').apply(null, [].splice.call(arguments, 0).reverse());
}
function configuration() {
    return {
        underscored: true,
        paranoid: true,
        deletedAt: 'deleted_date',
        createdAt: 'created_date',
        updatedAt: 'updated_date'
    };
}
function doneBy(DataTypes) {
    return {
        created_by: {
            type: DataTypes.UUID,
            allowNull: false
        },
        updated_by: {
            type: DataTypes.UUID,
            allowNull: false
        },
        deleted_by: {
            type: DataTypes.UUID
        }
    };
}
module.exports.configuration = configuration;
module.exports.doneBy = doneBy;
module.exports.merge = merge;
