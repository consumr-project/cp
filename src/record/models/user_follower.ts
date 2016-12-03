import { Config, Type, merge /* tracking */ } from '../utils';
import { DbmsDevice } from '../../device/dbms';
import { UUID } from '../../lang';
import { Message, IdentifiableMessage, StampedMessage } from '../message';

export interface UserFollowerMessage extends IdentifiableMessage, StampedMessage {
    f_user_id: UUID;
    user_id: UUID;
}

export default (device: DbmsDevice) => {
    var UserFollower = device.define<Message & UserFollowerMessage, UserFollowerMessage>('user_follower', merge({
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
