import { Config, Type, tracking, merge } from '../utils';
import { DbmsDevice } from '../../device/dbms';
import { UUID, Date2 } from '../../lang';
import { Message, IdentifiableMessage, StampedMessage } from '../message';

import gen_company from './company';

export interface QuestionMessage extends IdentifiableMessage, StampedMessage {
    company_id: UUID;
    titie: string;
    andwer: string;
    answered_by: UUID;
    answered_date: Date2;
    approved: boolean;
    approved_by: UUID;
    approved_date: Date2;
}

export default (device: DbmsDevice) => {
    var Company = gen_company(device);

    var Question = device.define<Message & QuestionMessage, QuestionMessage>('question', merge(tracking(), {
        id: {
            type: Type.UUID,
            primaryKey: true
        },

        company_id: {
            type: Type.UUID,
            allowNull: true
        },

        title: {
            type: Type.STRING,
            validate: {
                len: [1, 500]
            },
        },

        answer: {
            type: Type.TEXT,
            validate: {
                len: [1, 5000]
            },
        },

        answered_by: {
            type: Type.UUID,
            allowNull: true,
        },

        answered_date: {
            type: Type.DATE,
            allowNull: true,
        },

        approved: {
            type: Type.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },

        approved_by: {
            type: Type.UUID,
            allowNull: true,
        },

        approved_date: {
            type: Type.DATE,
            allowNull: true,
        },
    }), Config);

    Question.belongsTo(Company);

    return Question;
};
