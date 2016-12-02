import { Config, Type, tracking, merge } from '../utils';
import gen_user from './user';

export default sequelize => {
    var User = gen_user(sequelize),
        Review = require('./review')(sequelize);

    var UserReport = sequelize.define('user_report', merge(tracking(), {
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
    }), Config);

    UserReport.belongsTo(User);
    UserReport.belongsTo(Review);

    return UserReport;
};
