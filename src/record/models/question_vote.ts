import { Config, Type, tracking, merge } from '../utils';
import { DbmsDevice } from '../../device/dbms';
import { UUID } from '../../lang';
import { Message, IdentifiableMessage, StampedMessage } from '../message';

import gen_user from './user';
import gen_question from './question';

export interface QuestionMessage extends IdentifiableMessage, StampedMessage {
    question_id: UUID;
    user_id: UUID;
    score: number;
}

export default (device: DbmsDevice) => {
    var User = gen_user(device),
        Question = gen_question(device);

    var QuestionVote = device.define<Message & QuestionMessage, QuestionMessage>('question_vote', merge(tracking(), {
        question_id: {
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

    User.belongsToMany(Question, { through: QuestionVote });
    Question.belongsToMany(User, { through: QuestionVote });

    return QuestionVote;
};
