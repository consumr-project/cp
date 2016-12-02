import { Config, Type, tracking, merge } from '../utils';

import gen_user from './user';
import gen_company from './company';

export default sequelize => {
    var User = gen_user(sequelize),
        Company = gen_company(sequelize);

    var Review = sequelize.define('review', merge(tracking(), {
        id: {
            type: Type.UUID,
            primaryKey: true
        },

        user_id: {
            type: Type.UUID,
            allowNull: false
        },

        company_id: {
            type: Type.UUID,
            allowNull: true
        },

        score: {
            type: Type.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
                max: 5,
            },
        },

        title: {
            type: Type.STRING,
            validate: {
                len: [1, 500]
            },
        },

        summary: {
            type: Type.TEXT,
            validate: {
                len: [1, 5000]
            },
        },
    }), Config);

    Review.belongsTo(User);
    Review.belongsTo(Company);

    return Review;
};
