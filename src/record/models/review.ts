import { Config, Type, tracking, merge } from '../utils';
import { DbmsDevice } from '../../device/dbms';
import { UUID } from '../../lang';
import { Message, IdentifiableMessage, StampedMessage } from '../message';

import gen_user from './user';
import gen_company from './company';

export interface ReviewMessage extends IdentifiableMessage, StampedMessage {
    user_id: UUID;
    company_id: UUID;
    score: number;
    title: string;
    summary: string;
}

export default (device: DbmsDevice) => {
    var User = gen_user(device),
        Company = gen_company(device);

    var Review = device.define<Message & ReviewMessage, ReviewMessage>('review', merge(tracking(), {
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
