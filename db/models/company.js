'use strict';

var u = require('../../src/utils');

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('company', u.merge(u.doneBy(DataTypes), {
        id: {
            type: DataTypes.UUID,
            primaryKey: true
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false
        },

        summary: {
            type: DataTypes.TEXT
        }
    }), u.configuration());
};
