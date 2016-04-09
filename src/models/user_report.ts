import { CONFIG, TRACKING, merge } from '../utils';
import { DataTypes } from 'sequelize';

const Type: DataTypes = require('sequelize/lib/data-types');

export = sequelize => {
    var User = require('./user')(sequelize),
        Review = require('./review')(sequelize);

    var UserReport = sequelize.define('user_report', merge(TRACKING(), {
        id: {
            type: Type.UUID,
            primaryKey: true
        },

        user_id: {
            type: Type.UUID,
            allowNull: false
        },

        review_id: {
            type: Type.UUID,
            allowNull: true
        },

        summary: {
            type: Type.TEXT
        },
    }), CONFIG);

    UserReport.belongsTo(User);
    UserReport.belongsTo(Review);

    return UserReport;
};
