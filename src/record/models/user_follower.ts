import { Config, Type, merge /* tracking */ } from '../utils';

export = sequelize => {
    var UserFollower = sequelize.define('user_follower', merge({
        f_user_id: {
            type: Type.UUID,
            allowNull: false
        },

        user_id: {
            type: Type.UUID,
            allowNull: false
        }
    }), merge({
        indexes: [
            {
                name: 'user_followers_pkey',
                unique: true,
                method: 'BTREE',
                fields: ['f_user_id', 'user_id']
            }
        ]
    }, Config));

    UserFollower.removeAttribute('id');

    return UserFollower;
};
