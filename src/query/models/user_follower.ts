import { CONFIG, merge } from '../utils';
// XXX import { CONFIG, TRACKING, merge } from '../utils';
import { DataTypes } from 'sequelize';

const Type: DataTypes = require('sequelize/lib/data-types');

export = sequelize => {
    var User = require('./user')(sequelize);

    var UserFollower = sequelize.define('user_follower', merge({
        user_id: {
            type: Type.UUID,
            allowNull: false
        },

        f_user_id: {
            type: Type.UUID,
            allowNull: false
        }
    }), CONFIG);

    User.belongsToMany(User, { through: UserFollower, as: 'f_user_id' });

    return UserFollower;
};
