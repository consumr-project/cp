import { CONFIG, TRACKING, merge } from '../utils';
import { DataTypes } from 'sequelize';

const Type: DataTypes = require('sequelize/lib/data-types');

export = sequelize => {
    var User = require('./user')(sequelize),
        Question = require('./question')(sequelize);

    var QuestionVote = sequelize.define('question_vote', merge(TRACKING(), {
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
    }), CONFIG);

    User.belongsToMany(Question, { through: QuestionVote });
    Question.belongsToMany(User, { through: QuestionVote });

    return QuestionVote;
};
