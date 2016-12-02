import { Sequelize, Model } from 'sequelize';

let model = (name: string, conn: Sequelize): Model<any, any> =>
    require('./models/' + name)(conn, require('sequelize/lib/data-types'));

export default (conn) => {
    return {
        Company: model('company', conn),
        CompanyFollower: model('company_followers', conn),
        CompanyProduct: model('company_products', conn),
        EventBookmark: model('event_bookmarks', conn),
        Feedback: model('feedback', conn),
        Product: model('product', conn),
        Question: model('question', conn),
        QuestionVote: model('question_vote', conn),
        Review: model('review', conn),
        ReviewUsefulness: model('review_usefulness', conn),
        Tag: model('tag', conn),
        TagFollower: model('tag_follower', conn),
        UserFollower: model('user_follower', conn),
        UserReport: model('user_report', conn),
    };
};
