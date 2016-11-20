import { Config, Type, tracking, merge } from '../utils';
import gen_user from './user';

export = sequelize => {
    var User = gen_user(sequelize),
        Review = require('./review')(sequelize);

    var ReviewUsefulness = sequelize.define('review_usefulness', merge(tracking(), {
        review_id: {
            type: Type.UUID,
            allowNull: false
        },

        user_id: {
            type: Type.UUID,
            allowNull: false
        },

        score: {
            type: Type.INTEGER,
            allowNull: false,
            validate: {
                min: -1,
                max: 1,
            },
        },
    }), Config);

    User.belongsToMany(Review, { through: ReviewUsefulness });
    Review.belongsToMany(User, { through: ReviewUsefulness });

    return ReviewUsefulness;
};
