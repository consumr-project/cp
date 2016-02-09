"use strict";
var lodash_1 = require('lodash');
var Type = require('sequelize/lib/data-types');
function merge() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i - 0] = arguments[_i];
    }
    return lodash_1.merge.apply(null, args.reverse());
}
exports.merge = merge;
exports.CONFIG = {
    underscored: true,
    paranoid: true,
    deletedAt: 'deleted_date',
    createdAt: 'created_date',
    updatedAt: 'updated_date'
};
exports.TRACKING = function () {
    return {
        created_by: {
            type: Type.UUID,
            allowNull: false
        },
        updated_by: {
            type: Type.UUID,
            allowNull: false
        },
        deleted_by: {
            type: Type.UUID
        }
    };
};
