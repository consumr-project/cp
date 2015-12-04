'use strict';

/**
 * @param {Sequelize} sequelize
 * @param {Sequelize.DataTypes} DataTypes
 * @param {Function} require
 * @return {Function}
 */
function importer(sequelize, DataTypes, require) {
    return function (name) {
        return require('./db/models/' + name)(sequelize, DataTypes);
    };
}

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
        // XXX via relationship once User models exists
        created_by: {
            type: DataTypes.STRING,
            allowNull: false
        },

        // XXX via relationship once User models exists
        updated_by: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        // XXX via relationship once User models exists
        deleted_by: {
            type: DataTypes.STRING
        }
    };
}

module.exports.configuration = configuration;
module.exports.doneBy = doneBy;
module.exports.importer = importer;
module.exports.merge = merge;
