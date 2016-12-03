import { Config, Type, tracking, merge } from '../utils';
import { DbmsDevice } from '../../device/dbms';
import { UUID } from '../../lang';
import { Message, IdentifiableMessage, StampedMessage } from '../message';

import gen_user from './user';

export enum FeedbackType {
    question = <any>'question',
    suggestion = <any>'suggestion',
    problem = <any>'problem'
}

export interface FeedbackMessage extends IdentifiableMessage, StampedMessage {
    user_id: UUID;
    type: FeedbackType;
    referrer: string;
    message: string;
}

const STAMP = require('../../../dist/stamp.json');

export default (device: DbmsDevice) => {
    var User = gen_user(device);

    var Feedback = device.define<Message & FeedbackMessage, FeedbackMessage>('feedback', merge(tracking(), {
        id: {
            type: Type.UUID,
            allowNull: false,
            primaryKey: true
        },

        user_id: {
            type: Type.UUID,
            allowNull: false
        },

        type: {
            type: Type.ENUM('question', 'suggestion' ,'problem'),
            allowNull: false
        },

        referrer: {
            type: Type.STRING,
            validate: {
                len: [1, 100]
            },
        },

        message: {
            type: Type.TEXT,
            validate: {
                len: [1, 1000]
            },
        },
    }), merge(Config, {
        tableName: 'feedback',
        instanceMethods: {
            gen_name: function () {
                this.message = this.message || '';
                return `[${this.type}] ${this.message.substr(0, 100)}`;
            },

            gen_desc: function () {
                return `${this.message}

##### feedback record:
row id: ${this.id}
submitted by: ${this.user_id}
referrer: ${this.referrer}

##### instance stamp
stamp date: ${STAMP.date}
stamp head: ${STAMP.head}
stamp branch: ${STAMP.branch}`;
            },
        }
    }));

    Feedback.belongsTo(User);

    return Feedback;
};
