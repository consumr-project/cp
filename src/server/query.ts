import { Model } from 'sequelize';
import { Request, Response } from 'express';
import * as express from 'express';
import config = require('acm');

import * as crud from '../query/crud';
import { sql, query } from '../query/query';
import { can } from '../auth/permissions';

import gen_conn from '../query/conn';
import gen_models from '../query/models';

export var app = express();
export var conn = gen_conn();
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

// users
post('/users',
    can('create', 'user'),
    create(models.User));
get('/users/:id',
    can('retrieve', 'user'),
    retrieve(models.User));
del('/users/:id',
    can('delete', 'user'),
    remove(models.User));

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
    retrieve(models.Tag));
del('/tags/:id',
    can('delete', 'tag'),
    remove(models.Tag));

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
    can('create', 'company'),
    can('update', 'company'),
    upsert(models.CompanyFollower, ['company_id']));
get('/companies/:company_id/followers/:id?',
    can('retrieve', 'company'),
    retrieve(models.CompanyFollower, {company_id: 'company_id', user_id: 'id'}));
del('/companies/:company_id/followers/:id',
    can('update', 'company'),
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
del('/reviews/:review_id',
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
    can('delete', 'event'),
    remove(models.EventBookmark, {event_id: 'event_id', user_id: 'id'}));

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

app.use((err: any, req: Request, res: Response, next: Function) => {
    console.error(err);
    res.status(500);
    res.json(<CPServiceResponseV1<void>>{
        meta: {
            ok: false,
            error: true,
            error_msg: err.message
        },
        body: {}
    });
});
