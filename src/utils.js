'use strict';

/**
 * @param {Sequelize} sequelize
 * @param {Sequelize.DataTypes} DataTypes
 * @param {Function} require
 * @return {Function}
 */
function importer(sequelize, DataTypes, require) {
    return function (name) {
        return require('./models/' + name)(sequelize, DataTypes);
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
        createdAt: 'created_at',
        updatedAt: 'updated_at'
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
            type: DataTypes.STRING,
            allowNull: false
        },

        updated_by: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        deleted_by: {
            type: DataTypes.STRING
        }
    };
}

module.exports.configuration = configuration;
module.exports.doneBy = doneBy;
module.exports.importer = importer;
module.exports.merge = merge;
