import { Sequelize, Model } from 'sequelize';

let model = (name: string, conn: Sequelize): Model<any, any> =>
    require('./models/' + name)(conn, require('sequelize/lib/data-types'));

export default (conn) => {
    return {
        Company: model('company', conn),
        CompanyEvent: model('company_events', conn),
        CompanyFollower: model('company_followers', conn),
        CompanyProduct: model('company_products', conn),
        Event: model('event', conn),
        EventBookmark: model('event_bookmarks', conn),
        EventSource: model('event_source', conn),
        EventTag: model('event_tag', conn),
        Product: model('product', conn),
        Question: model('question', conn),
        QuestionVote: model('question_vote', conn),
        Review: model('review', conn),
        ReviewUsefulness: model('review_usefulness', conn),
        Tag: model('tag', conn),
        User: model('user', conn),
        UserReport: model('user_report', conn),
    };
};
