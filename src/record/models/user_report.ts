import { Config, Type, tracking, merge } from '../utils';

import gen_user from './user';
import gen_review from './review';

export default sequelize => {
    var User = gen_user(sequelize),
        Review = gen_review(sequelize);

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
