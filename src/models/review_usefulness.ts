import { CONFIG, TRACKING, merge } from '../utils';
import { DataTypes } from 'sequelize';

const Type: DataTypes = require('sequelize/lib/data-types');

export = sequelize => {
    var User = require('./user')(sequelize),
        Review = require('./review')(sequelize);

    var ReviewUsefulness = sequelize.define('review_usefulness', merge(TRACKING(), {
        review_id: {
            type: Type.UUID,
            allowNull: false
        },

        user_id: {
            type: Type.UUID,
            allowNull: false
        },

        // XXX -1 or 1. figure out how to set min/max
        score: {
            type: Type.INTEGER,
            allowNull: false
        },
    }), CONFIG);

    User.belongsToMany(Review, { through: ReviewUsefulness });
    Review.belongsToMany(User, { through: ReviewUsefulness });

    return ReviewUsefulness;
};
