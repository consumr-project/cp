import { Config, Type, tracking, merge } from '../utils';
import { DbmsDevice } from '../../device/dbms';
import { UUID } from '../../lang';
import { Message, IdentifiableMessage, StampedMessage } from '../message';

import gen_user from './user';
import gen_review from './review';

export interface ReviewUsefulnessMessage extends IdentifiableMessage, StampedMessage {
    review_id: UUID;
    user_id: UUID;
    scopre: number;
}

export default (device: DbmsDevice) => {
    var User = gen_user(device),
        Review = gen_review(device);

    var ReviewUsefulness = device.define<Message & ReviewUsefulnessMessage, ReviewUsefulnessMessage>('review_usefulness', merge(tracking(), {
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
