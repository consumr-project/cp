import { Config, Type, merge /* tracking */ } from '../utils';
import { DbmsDevice } from '../../device/dbms';
import { UUID } from '../../lang';
import { Message, IdentifiableMessage, StampedMessage } from '../message';

import gen_user from './user';
import gen_tag from './tag';

export interface TagFollowerMessage extends IdentifiableMessage, StampedMessage {
    tag_id: UUID;
    user_id: UUID;
}

export default (device: DbmsDevice) => {
    var User = gen_user(device),
        Tag = gen_tag(device);

    var TagFollower = device.define<Message & TagFollowerMessage, TagFollowerMessage>('tag_follower', merge({
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
