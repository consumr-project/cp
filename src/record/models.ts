import { Sequelize, Model } from 'sequelize';

let model = (name: string, conn: Sequelize): Model<any, any> =>
    require('./models/' + name)(conn, require('sequelize/lib/data-types'));

export default (conn) => {
    return {
        Feedback: model('feedback', conn),
        Product: model('product', conn),
        Question: model('question', conn),
        QuestionVote: model('question_vote', conn),
    };
};
