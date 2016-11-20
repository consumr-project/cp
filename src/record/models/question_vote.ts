import { Config, Type, tracking, merge } from '../utils';
import gen_user from './user';

export = sequelize => {
    var User = gen_user(sequelize),
        Question = require('./question')(sequelize);

    var QuestionVote = sequelize.define('question_vote', merge(tracking(), {
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
