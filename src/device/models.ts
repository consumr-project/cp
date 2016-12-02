import { default as gen_models } from '../record/models';

import { UUID } from '../lang';

import connect from './dbms';
import gen_beta_email_invite from '../record/models/beta_email_invite';
import gen_company from '../record/models/company';
import gen_company_event from '../record/models/company_events';
import gen_company_follower from '../record/models/company_followers';
import gen_company_product from '../record/models/company_products';
import gen_event from '../record/models/event';
import gen_event_bookmark from '../record/models/event_bookmarks';
import gen_event_source from '../record/models/event_source';
import gen_event_tag from '../record/models/event_tag';
import gen_tag from '../record/models/tag';
import gen_token from '../record/models/token';
import gen_user from '../record/models/user';
import gen_user_report from '../record/models/user_report';

export const conn = connect();
export const models = gen_models(conn);

export const BetaEmailInvite = gen_beta_email_invite(conn);
export const Company = gen_company(conn);
export const CompanyEvent = gen_company_event(conn);
export const CompanyFollower = gen_company_follower(conn);
export const CompanyProduct = gen_company_product(conn);
export const Event = gen_event(conn);
export const EventBookmark = gen_event_bookmark(conn);
export const EventSource = gen_event_source(conn);
export const EventTag = gen_event_tag(conn);
export const Feedback = models.Feedback;
export const Product = models.Product;
export const Question = models.Question;
export const QuestionVote = models.QuestionVote;
export const Review = models.Review;
export const ReviewUsefulness = models.ReviewUsefulness;
export const Tag = gen_tag(conn);
export const TagFollower = models.TagFollower;
export const Token = gen_token(conn);
export const User = gen_user(conn);
export const UserFollower = models.UserFollower;
export const UserReport = gen_user_report(conn);

export interface Record {
    id: UUID;
}
