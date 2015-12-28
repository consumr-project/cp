'use strict';

var u = require('../../src/utils');

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('event', u.merge(u.doneBy(DataTypes), {
        id: {
            type: DataTypes.UUID,
            primaryKey: true
        },

        title: {
            type: DataTypes.STRING,
            allowNull: false
        },

        date: {
            type: DataTypes.DATE,
            allowNull: false
        },

        sentiment: {
            type: DataTypes.ENUM('positive', 'negative', 'neutral'),
            allowNull: false
        }
    }), u.configuration());
};
