import { default as gen_models } from '../record/models';

import { UUID } from '../lang';

import gen_user from '../record/models/user';
import gen_event from '../record/models/event';
import gen_event_source from '../record/models/event_source';
import gen_company_event from '../record/models/company_events';
import gen_event_tag from '../record/models/event_tag';
import connect from './dbms';

export const conn = connect();
export const models = gen_models(conn);

export const BetaEmailInvite = models.BetaEmailInvite;
export const Company = models.Company;
export const CompanyEvent = gen_company_event(conn);
export const CompanyFollower = models.CompanyFollower;
export const CompanyProduct = models.CompanyProduct;
export const Event = gen_event(conn);
export const EventBookmark = models.EventBookmark;
export const EventSource = gen_event_source(conn);
export const EventTag = gen_event_tag(conn);
export const Feedback = models.Feedback;
export const Product = models.Product;
export const Question = models.Question;
export const QuestionVote = models.QuestionVote;
export const Review = models.Review;
export const ReviewUsefulness = models.ReviewUsefulness;
export const Tag = models.Tag;
export const TagFollower = models.TagFollower;
export const Token = models.Token;
export const User = gen_user(conn);
export const UserFollower = models.UserFollower;
export const UserReport = models.UserReport;

export interface Record {
    id: UUID;
}
