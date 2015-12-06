'use strict';

/**
 * @param {Object} obj*
 * @return {Object}
 */
function merge() {
    return require('lodash/object/merge').apply(null, [].splice.call(arguments, 0).reverse());
}

/**
 * default model configuration
 * @return {Object}
 */
function configuration() {
    return {
        underscored: true,
        paranoid: true,
        deletedAt: 'deleted_date',
        createdAt: 'created_date',
        updatedAt: 'updated_date'
    };
}

/**
 * created_by, updated_by, and deleted_by fields
 * @param {Sequelize.DataTypes} DataTypes
 * @return {Object}
 */
function doneBy(DataTypes) {
    return {
        created_by: {
            type: DataTypes.UUID,
            allowNull: false
        },

        updated_by: {
            type: DataTypes.UUID,
            allowNull: false,
        },

        deleted_by: {
            type: DataTypes.STRING
        }
    };
}

module.exports.configuration = configuration;
module.exports.doneBy = doneBy;
module.exports.merge = merge;
