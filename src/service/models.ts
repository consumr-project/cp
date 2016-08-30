import { default as gen_models } from '../record/models';
import connect from './dbms';

export const conn = connect();
export const models = gen_models(conn);

export const Company = models.Company;
export const CompanyEvent = models.CompanyEvent;
export const CompanyFollower = models.CompanyFollower;
export const CompanyProduct = models.CompanyProduct;
export const Event = models.Event;
export const EventBookmark = models.EventBookmark;
export const EventSource = models.EventSource;
export const EventTag = models.EventTag;
export const Feedback = models.Feedback;
export const Product = models.Product;
export const Question = models.Question;
export const QuestionVote = models.QuestionVote;
export const Review = models.Review;
export const ReviewUsefulness = models.ReviewUsefulness;
export const Tag = models.Tag;
export const TagFollower = models.TagFollower;
export const Token = models.Token;
export const User = models.User;
export const UserFollower = models.UserFollower;
export const UserReport = models.UserReport;
