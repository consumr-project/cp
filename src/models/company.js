'use strict';

var u = require('../../src/utils');

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('company', u.merge(u.doneBy(DataTypes), {
        id: {
            type: DataTypes.UUID,
            primaryKey: true
        },

        guid: {
            type: DataTypes.STRING,
            unique: true
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false
        },

        summary: {
            type: DataTypes.TEXT
        },

        wikipedia_page_id: {
            type: DataTypes.STRING
        }
    }), u.configuration());
};
