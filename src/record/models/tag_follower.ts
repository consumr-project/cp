import { Config, Type, merge /* tracking */ } from '../utils';

import gen_user from './user';
import gen_tag from './tag';

export default sequelize => {
    var User = gen_user(sequelize),
        Tag = gen_tag(sequelize);

    var TagFollower = sequelize.define('tag_follower', merge({
        tag_id: {
            type: Type.UUID,
            allowNull: false
        },

        user_id: {
            type: Type.UUID,
            allowNull: false
        }
    }), Config);

    Tag.belongsToMany(User, { through: TagFollower });
    User.belongsToMany(Tag, { through: TagFollower });

    return TagFollower;
};
