'use strict';

var u = require('../../src/utils');

module.exports = function (sequelize, DataTypes) {
    var Event = require('./event')(sequelize, DataTypes);
    var Source = sequelize.define('source', u.merge(u.doneBy(DataTypes), {
        id: {
            type: DataTypes.UUID,
            primaryKey: true
        },

        title: {
            type: DataTypes.STRING
        },

        url: {
            type: DataTypes.STRING,
            allowNull: false
        },

        published_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
    }), u.configuration());

    Source.belongsTo(Event);

    return Source;
};
