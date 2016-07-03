import { ServiceResponseV1 } from 'cp';
import { Request, Response } from 'express';

import { ServiceUnavailableError } from '../errors';
import * as express from 'express';
import * as crud from '../record/crud';
import { sql, query } from '../record/query';
import { can } from '../auth/permissions';
import { card } from '../notification/trello';
import { service_cache_intercept } from '../utilities';

import { shared, quick_save } from '../service/cache';
import connect_mongo from '../service/mongo';
import connect from '../service/dbms';
import gen_models from '../record/models';
import config = require('acm');

export var app = express();
export var conn = connect();
export var models = gen_models(conn);

var post = app.post.bind(app),
    get = app.get.bind(app),
    put = app.put.bind(app),
    del = app.delete.bind(app),
    patch = app.patch.bind(app);

var all = crud.all,
    create = crud.create,
    like = crud.like,
    parts = crud.parts,
    remove = crud.del,
    retrieve = crud.retrieve,
    update = crud.update,
    upsert = crud.upsert;

connect_mongo(config('mongo.collections.cache'), (err, coll) => {
    app.use((req, res, next) => {
        if (err) {
            next(new ServiceUnavailableError());
        } else {
            next();
        }
    });

    get('/stats/trending',
        can('retrieve', 'tag'),
        can('retrieve', 'company'),
        can('retrieve', 'event'),
        service_cache_intercept(shared(coll), 'trending_events'),
        query(conn, sql('get-trending-events'), false, {}, quick_save(shared(coll), 'trending_events')));
});

// users
post('/users',
    can('create', 'user'),
    create(models.User));
get('/users/:id',
    can('retrieve', 'user'),
    parts(models.User, {
        followers: [models.UserFollower, {f_user_id: 'id'}, {
            instead: {
                includes_me: true
            }
        }],
    }));
del('/users/:id',
    can('delete', 'user'),
    remove(models.User));

get('/users/:id/stats',
    can('retrieve', 'user'),
    query(conn, sql('get-user-stats'), true));
get('/users/:id/stats/contributions/questions',
    can('retrieve', 'company'),
    query(conn, sql('get-user-contributions-questions'), false, { offset: 0 }));
get('/users/:id/stats/contributions/companies',
    can('retrieve', 'company'),
    query(conn, sql('get-user-contributions-companies'), false, { offset: 0 }));
get('/users/:id/stats/contributions/sources',
    can('retrieve', 'event'),
    query(conn, sql('get-user-contributions-sources'), false, { offset: 0 }));
get('/users/:id/stats/contributions/events',
    can('retrieve', 'event'),
    query(conn, sql('get-user-contributions-events'), false, { offset: 0 }));
get('/users/:id/stats/favorites/events',
    can('retrieve', 'event'),
    query(conn, sql('get-user-favorites-events'), false, { offset: 0 }));
get('/users/:id/stats/contributions/reviews',
    can('retrieve', 'review'),
    query(conn, sql('get-user-contributions-reviews'), false, { offset: 0 }));
get('/users/:id/stats/following/tags',
    can('retrieve', 'tag'),
    query(conn, sql('get-user-following-tags'), false, { offset: 0 }));
get('/users/:id/stats/following/companies',
    can('retrieve', 'company'),
    query(conn, sql('get-user-following-companies'), false, { offset: 0 }));
get('/users/:id/stats/following/users',
    can('retrieve', 'user'),
    query(conn, sql('get-user-following-users'), false, { offset: 0 }));
get('/users/:id/stats/followers/users',
    can('retrieve', 'user'),
    query(conn, sql('get-user-followers-users'), false, { offset: 0 }));

patch('/users/:f_user_id/followers',
    can('follow', 'user'),
    upsert(models.UserFollower, ['f_user_id']));
get('/users/:f_user_id/followers/:id?',
    can('follow', 'user'),
    retrieve(models.UserFollower, {f_user_id: 'f_user_id', user_id: 'id'}));
del('/users/:f_user_id/followers/:id',
    can('follow', 'user'),
    remove(models.UserFollower, {f_user_id: 'f_user_id', user_id: 'id'}));

// products
get('/products',
    can('retrieve', 'product'),
    all(models.Product));
post('/products',
    can('create', 'product'),
    create(models.Product));
get('/products/:id',
    can('retrieve', 'product'),
    retrieve(models.Product));

// tags
get('/tags',
    can('retrieve', 'tag'),
    all(models.Tag));
post('/tags',
    can('create', 'tag'),
    create(models.Tag));
get('/tags/like',
    can('retrieve', 'tag'),
    (req, res, next) => {
        if (req.query.s && req.query.s) {
            req.query.s = [].concat(req.query.s);
            req.query.s.forEach((val, i) => {
                req.query['slist' + i] = val;
                req.query['ilist' + i] = '%' + val + '%';
            });
        }

        next();
    },
    query(conn, sql('get-like-tags')));
get('/tags/:id',
    can('retrieve', 'tag'),
    parts(models.Tag, {
        followers: [models.TagFollower, {tag_id: 'id'}, {
            instead: {
                includes_me: true
            }
        }],
    }));
del('/tags/:id',
    can('delete', 'tag'),
    remove(models.Tag));

get('/tags/:tag_id/common/companies',
    can('retrieve', 'company'),
    query(conn, sql('get-tag-common-companies')));

get('/tags/:tag_id/common/tags',
    can('retrieve', 'tag'),
    query(conn, sql('get-tag-related-tags')));

get('/tags/:tag_id/events/timeline',
    can('retrieve', 'tag'),
    can('retrieve', 'event'),
    query(conn, sql('get-tag-events')));

patch('/tags/:tag_id/followers',
    can('follow', 'tag'),
    upsert(models.TagFollower, ['tag_id']));
get('/tags/:tag_id/followers/:id?',
    can('follow', 'tag'),
    retrieve(models.TagFollower, {tag_id: 'tag_id', user_id: 'id'}));
del('/tags/:tag_id/followers/:id',
    can('follow', 'tag'),
    remove(models.TagFollower, {tag_id: 'tag_id', user_id: 'id'}));

// companies
post('/companies',
    can('create', 'company'),
    create(models.Company));
get('/companies/guid/:id',
    can('retrieve', 'company'),
    retrieve(models.Company, {guid: 'id'}));
get('/companies',
    can('retrieve', 'company'),
    retrieve(models.Company));
get('/companies/:id',
    can('retrieve', 'company'),
    can('retrieve', 'product'),
    parts(models.Company, {
        products: [models.CompanyProduct, {company_id: 'id'}, {
            expand: [models.Product, {id: 'product_id'}]
        }],
        followers: [models.CompanyFollower, {company_id: 'id'}, {
            instead: {
                includes_me: true
            }
        }],
    }
));
put('/companies/:id',
    can('update', 'company'),
    update(models.Company));
del('/companies/:id',
    can('delete', 'company'),
    remove(models.Company));

patch('/companies/:company_id/products',
    can('create', 'company'),
    can('update', 'company'),
    upsert(models.CompanyProduct, ['company_id']));
get('/companies/:company_id/products/:id?',
    can('retrieve', 'company'),
    retrieve(models.CompanyProduct, {company_id: 'company_id', product_id: 'id'}));
del('/companies/:company_id/products/:id',
    can('delete', 'company'),
    remove(models.CompanyProduct, {company_id: 'company_id', product_id: 'id'}));

patch('/companies/:company_id/followers',
    can('follow', 'company'),
    upsert(models.CompanyFollower, ['company_id']));
get('/companies/:company_id/followers/:id?',
    can('follow', 'company'),
    retrieve(models.CompanyFollower, {company_id: 'company_id', user_id: 'id'}));
del('/companies/:company_id/followers/:id',
    can('follow', 'company'),
    remove(models.CompanyFollower, {company_id: 'company_id', user_id: 'id'}));

patch('/companies/:company_id/events',
    can('create', 'company'),
    can('update', 'company'),
    upsert(models.CompanyEvent, ['company_id']));
get('/companies/:company_id/events/timeline',
    can('retrieve', 'company'),
    can('retrieve', 'event'),
    query(conn, sql('get-company-events')));
get('/companies/:company_id/events/:id?',
    can('retrieve', 'company'),
    retrieve(models.CompanyEvent, {company_id: 'company_id', event_id: 'id'}));
del('/companies/:company_id/events/:id',
    can('delete', 'company'),
    remove(models.CompanyEvent, {company_id: 'company_id', event_id: 'id'}));

// special company queries
get('/companies/:company_id/common/companies',
    can('retrieve', 'company'),
    query(conn, sql('get-company-related-companies')));

get('/companies/:company_id/common/tags',
    can('retrieve', 'tag'),
    query(conn, sql('get-company-common-tags')));

// reviews
post('/companies/:company_id/reviews',
    can('create', 'review'),
    can('update', 'company'),
    create(models.Review, ['company_id']));
get('/companies/:company_id/reviews',
    can('retrieve', 'review'),
    query(conn, sql('get-company-reviews'), false, { offset: 0 }));
get('/companies/:company_id/reviews/score',
    can('retrieve', 'review'),
    query(conn, sql('get-company-reviews-score'), true));
get('/companies/:company_id/reviews/summary',
    can('retrieve', 'review'),
    query(conn, sql('get-company-reviews-summary')));
patch('/reviews/:review_id/useful',
    can('update', 'review'),
    upsert(models.ReviewUsefulness, ['review_id']));
del('/reviews/:review_id/useful/:user_id',
    can('update', 'review'),
    remove(models.ReviewUsefulness, {review_id: 'review_id', user_id: 'user_id'}));
del('/reviews/:id',
    can('delete', 'review'),
    remove(models.Review));

// questions
post('/companies/:company_id/questions',
    can('create', 'question'),
    can('update', 'company'),
    create(models.Question, ['company_id']));
get('/companies/:company_id/questions',
    can('retrieve', 'question'),
    query(conn, sql('get-company-questions'), false, { offset: 0 }));
patch('/questions/:question_id/vote',
    can('update', 'question'),
    upsert(models.QuestionVote, ['question_id']));
get('/questions/:id',
    can('retrieve', 'question'),
    retrieve(models.Question));
del('/questions/:id',
    can('delete', 'question'),
    remove(models.Question));

// events
post('/events',
    can('create', 'event'),
    create(models.Event));
patch('/events',
    can('create', 'event'),
    can('update', 'event'),
    upsert(models.Event));
del('/events/:id',
    can('delete', 'event'),
    remove(models.Event));
get('/events',
    can('retrieve', 'event'),
    retrieve(models.Event));
get('/events/:id',
    can('retrieve', 'event'),
    can('retrieve', 'tag'),
    can('retrieve', 'company'),
    parts(models.Event, {
        sources: [models.EventSource, {event_id: 'id'}],
        tags: [models.EventTag, {event_id: 'id'}, {
            expand: [models.Tag, {id: 'tag_id'}]
        }],
        companies: [models.CompanyEvent, {event_id: 'id'}, {
            expand: [models.Company, {id: 'company_id'}]
        }],
        bookmarks: [models.EventBookmark, {event_id: 'id'}, {
            instead: {
                count: true,
                includes_me: true
            }
        }],
    }
));

patch('/events/:event_id/sources',
    can('create', 'event'),
    can('update', 'event'),
    upsert(models.EventSource, ['event_id']));
get('/events/:event_id/sources/:id?',
    can('retrieve', 'event'),
    retrieve(models.EventSource, {event_id: 'event_id'}));

patch('/events/:event_id/tags',
    can('create', 'event'),
    can('update', 'event'),
    upsert(models.EventTag, ['event_id']));
get('/events/:event_id/tags/:id?',
    can('retrieve', 'event'),
    retrieve(models.EventTag, {event_id: 'event_id'}));

// managed through companies
get('/events/:event_id/companies',
    can('retrieve', 'event'),
    can('retrieve', 'company'),
    retrieve(models.CompanyEvent, {event_id: 'event_id'}));

patch('/events/:event_id/bookmarks',
    can('create', 'event'),
    can('update', 'event'),
    upsert(models.EventBookmark, ['event_id']));
get('/events/:event_id/bookmarks/:id?',
    can('retrieve', 'event'),
    retrieve(models.EventBookmark, {event_id: 'event_id', user_id: 'id'}));
del('/events/:event_id/bookmarks/:id',
    can('update', 'event'),
    remove(models.EventBookmark, {event_id: 'event_id', user_id: 'id'}));

// feedback
post('/feedback',
    can('create', 'feedback'),
    create(models.Feedback, [], (feedback) =>
        card.add(feedback.gen_name(), feedback.gen_desc())));
get('/feedback/:id',
    can('retrieve', 'feedback'),
    retrieve(models.Feedback));
del('/feedback/:id',
    can('delete', 'feedback'),
    remove(models.Feedback));

// search
get('/search/products/en-US',
    can('retrieve', 'product'),
    like(models.Product, 'en-US'));
get('/search/tags/en-US',
    can('retrieve', 'tag'),
    like(models.Tag, 'en-US'));
get('/search/companies/name',
    can('retrieve', 'company'),
    like(models.Company, 'name'));
