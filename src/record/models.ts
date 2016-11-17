import { Sequelize, Model } from 'sequelize';

import gen_user from './models/user';

let model = (name: string, conn: Sequelize): Model<any, any> =>
    require('./models/' + name)(conn, require('sequelize/lib/data-types'));

export default (conn) => {
    return {
        BetaEmailInvite: model('beta_email_invite', conn),
        Company: model('company', conn),
        CompanyEvent: model('company_events', conn),
        CompanyFollower: model('company_followers', conn),
        CompanyProduct: model('company_products', conn),
        Event: model('event', conn),
        EventBookmark: model('event_bookmarks', conn),
        EventSource: model('event_source', conn),
        EventTag: model('event_tag', conn),
        Feedback: model('feedback', conn),
        Product: model('product', conn),
        Question: model('question', conn),
        QuestionVote: model('question_vote', conn),
        Review: model('review', conn),
        ReviewUsefulness: model('review_usefulness', conn),
        Tag: model('tag', conn),
        TagFollower: model('tag_follower', conn),
        Token: model('token', conn),
        User: gen_user(conn),
        UserFollower: model('user_follower', conn),
        UserReport: model('user_report', conn),
    };
};
