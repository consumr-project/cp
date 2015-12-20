'use strict';

var u = require('../../src/utils');

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('tag', u.merge(u.doneBy(DataTypes), {
        id: {
            type: DataTypes.UUID,
            primaryKey: true
        },

        'en-US': {
            type: DataTypes.STRING,
            allowNull: false
        }
    }), u.configuration());
};
