import { CONFIG, merge } from '../utils';
// XXX import { CONFIG, TRACKING, merge } from '../utils';
import { DataTypes } from 'sequelize';

const Type: DataTypes = require('sequelize/lib/data-types');

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
    }, CONFIG));

    UserFollower.removeAttribute('id');

    return UserFollower;
};
