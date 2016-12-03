import * as SequelizeBase from 'sequelize';
import { Message } from '../record/message';
import connect from './dbms';

import gen_beta_email_invite from '../record/models/beta_email_invite';
import gen_company from '../record/models/company';
import gen_feedback from '../record/models/feedback';
import gen_company_event from '../record/models/company_event';
import gen_company_follower from '../record/models/company_follower';
import gen_company_product from '../record/models/company_product';
import gen_event from '../record/models/event';
import gen_event_bookmark from '../record/models/event_bookmark';
import gen_event_source from '../record/models/event_source';
import gen_event_tag from '../record/models/event_tag';
import gen_product from '../record/models/product';
import gen_question from '../record/models/question';
import gen_question_vote from '../record/models/question_vote';
import gen_review from '../record/models/review';
import gen_review_usefulness from '../record/models/review_usefulness';
import gen_tag from '../record/models/tag';
import gen_tag_follower from '../record/models/tag_follower';
import gen_token from '../record/models/token';
import gen_user from '../record/models/user';
import gen_user_follower from '../record/models/user_follower';
import gen_user_report from '../record/models/user_report';

export interface Model<T> extends SequelizeBase.Model<Message & T, T> {}

export const conn = connect();

export const BetaEmailInvite = gen_beta_email_invite(conn);
export const Company = gen_company(conn);
export const CompanyEvent = gen_company_event(conn);
export const CompanyFollower = gen_company_follower(conn);
export const CompanyProduct = gen_company_product(conn);
export const Event = gen_event(conn);
export const EventBookmark = gen_event_bookmark(conn);
export const EventSource = gen_event_source(conn);
export const EventTag = gen_event_tag(conn);
export const Feedback = gen_feedback(conn);
export const Product = gen_product(conn);
export const Question = gen_question(conn);
export const QuestionVote = gen_question_vote(conn);
export const Review = gen_review(conn);
export const ReviewUsefulness = gen_review_usefulness(conn);
export const Tag = gen_tag(conn);
export const TagFollower = gen_tag_follower(conn);
export const Token = gen_token(conn);
export const User = gen_user(conn);
export const UserFollower = gen_user_follower(conn);
export const UserReport = gen_user_report(conn);
