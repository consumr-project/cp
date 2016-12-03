import { Config, Type, tracking, merge } from '../utils';
import { DbmsDevice } from '../../device/dbms';
import { UUID } from '../../lang';
import { Message, IdentifiableMessage, StampedMessage } from '../message';

import gen_user from './user';
import gen_review from './review';

export interface UserReportMessage extends IdentifiableMessage, StampedMessage {
    user_id: UUID;
    review_id: UUID;
    summary: string;
}

export default (device: DbmsDevice) => {
    var User = gen_user(device),
        Review = gen_review(device);

    var UserReport = device.define<Message & UserReportMessage, UserReportMessage>('user_report', merge(tracking(), {
        id: {
            type: Type.UUID,
            primaryKey: true
        },

        user_id: {
            type: Type.UUID,
            allowNull: false
        },

        review_id: {
            type: Type.UUID,
            allowNull: true
        },

        summary: {
            type: Type.TEXT
        },
    }), Config);

    UserReport.belongsTo(User);
    UserReport.belongsTo(Review);

    return UserReport;
};
