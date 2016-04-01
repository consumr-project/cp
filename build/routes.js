"use strict";
var fs_1 = require('fs');
var lodash_1 = require('lodash');
exports.__esModule = true;
exports["default"] = function (app, models, conn) {
    var crud = require('./crud'), query = require('./query').default, can = require('auth-service').permissions.can;
    var sql = function (name) {
        return lodash_1.template(fs_1.readFileSync(__dirname + "/../db/queries/" + name + ".sql").toString());
    };
    var post = app.post.bind(app), get = app.get.bind(app), put = app.put.bind(app), del = app.delete.bind(app), patch = app.patch.bind(app);
    var all = crud.all, create = crud.create, like = crud.like, parts = crud.parts, remove = crud.del, retrieve = crud.retrieve, update = crud.update, upsert = crud.upsert;
    post('/users', can('create', 'user'), create(models.User));
    get('/users/:id', can('retrieve', 'user'), retrieve(models.User));
    del('/users/:id', can('delete', 'user'), remove(models.User));
    get('/products', can('retrieve', 'product'), all(models.Product));
    post('/products', can('create', 'product'), create(models.Product));
    get('/products/:id', can('retrieve', 'product'), retrieve(models.Product));
    get('/tags', can('retrieve', 'tag'), all(models.Tag));
    post('/tags', can('create', 'tag'), create(models.Tag));
    get('/tags/:id', can('retrieve', 'tag'), retrieve(models.Tag));
    del('/tags/:id', can('delete', 'tag'), remove(models.Tag));
    post('/companies', can('create', 'company'), create(models.Company));
    get('/companies/guid/:id', can('retrieve', 'company'), retrieve(models.Company, { guid: 'id' }));
    get('/companies', can('retrieve', 'company'), retrieve(models.Company));
    get('/companies/:id', can('retrieve', 'company'), can('retrieve', 'product'), parts(models.Company, {
        products: [models.CompanyProduct, { company_id: 'id' }, {
                expand: [models.Product, { id: 'product_id' }]
            }],
        followers: [models.CompanyFollower, { company_id: 'id' }, {
                instead: {
                    includes_me: true
                }
            }]
    }));
    put('/companies/:id', can('update', 'company'), update(models.Company));
    del('/companies/:id', can('delete', 'company'), remove(models.Company));
    patch('/companies/:company_id/products', can('create', 'company'), can('update', 'company'), upsert(models.CompanyProduct, ['company_id']));
    get('/companies/:company_id/products/:id?', can('retrieve', 'company'), retrieve(models.CompanyProduct, { company_id: 'company_id', product_id: 'id' }));
    del('/companies/:company_id/products/:id', can('delete', 'company'), remove(models.CompanyProduct, { company_id: 'company_id', product_id: 'id' }));
    patch('/companies/:company_id/followers', can('create', 'company'), can('update', 'company'), upsert(models.CompanyFollower, ['company_id']));
    get('/companies/:company_id/followers/:id?', can('retrieve', 'company'), retrieve(models.CompanyFollower, { company_id: 'company_id', user_id: 'id' }));
    del('/companies/:company_id/followers/:id', can('update', 'company'), remove(models.CompanyFollower, { company_id: 'company_id', user_id: 'id' }));
    patch('/companies/:company_id/events', can('create', 'company'), can('update', 'company'), upsert(models.CompanyEvent, ['company_id']));
    get('/companies/:company_id/events/:id?', can('retrieve', 'company'), retrieve(models.CompanyEvent, { company_id: 'company_id', event_id: 'id' }));
    del('/companies/:company_id/events/:id', can('delete', 'company'), remove(models.CompanyEvent, { company_id: 'company_id', event_id: 'id' }));
    get('/companies/:company_id/common/companies', can('retrieve', 'company'), query(conn, sql('get-company-related-companies')));
    get('/companies/:company_id/common/tags', can('retrieve', 'tag'), query(conn, sql('get-company-common-tags')));
    post('/companies/:company_id/reviews', can('create', 'review'), can('update', 'company'), create(models.Review, ['company_id']));
    get('/companies/:company_id/reviews', can('retrieve', 'review'), query(conn, sql('get-company-reviews')));
    patch('/reviews/:review_id/usefull', can('update', 'review'), upsert(models.ReviewUsefulness, ['review_id']));
    del('/reviews/:review_id/usefull/:user_id', can('update', 'review'), remove(models.ReviewUsefulness, { review_id: 'review_id', user_id: 'user_id' }));
    del('/reviews/:review_id', can('delete', 'review'), remove(models.Review));
    post('/events', can('create', 'event'), create(models.Event));
    patch('/events', can('create', 'event'), can('update', 'event'), upsert(models.Event));
    del('/events/:id', can('delete', 'event'), remove(models.Event));
    get('/events', can('retrieve', 'event'), retrieve(models.Event));
    get('/events/:id', can('retrieve', 'event'), can('retrieve', 'tag'), can('retrieve', 'company'), parts(models.Event, {
        sources: [models.EventSource, { event_id: 'id' }],
        tags: [models.EventTag, { event_id: 'id' }, {
                expand: [models.Tag, { id: 'tag_id' }]
            }],
        companies: [models.CompanyEvent, { event_id: 'id' }, {
                expand: [models.Company, { id: 'company_id' }]
            }],
        bookmarks: [models.EventBookmark, { event_id: 'id' }, {
                instead: {
                    count: true,
                    includes_me: true
                }
            }]
    }));
    patch('/events/:event_id/sources', can('create', 'event'), can('update', 'event'), upsert(models.EventSource, ['event_id']));
    get('/events/:event_id/sources/:id?', can('retrieve', 'event'), retrieve(models.EventSource, { event_id: 'event_id' }));
    patch('/events/:event_id/tags', can('create', 'event'), can('update', 'event'), upsert(models.EventTag, ['event_id']));
    get('/events/:event_id/tags/:id?', can('retrieve', 'event'), retrieve(models.EventTag, { event_id: 'event_id' }));
    get('/events/:event_id/companies', can('retrieve', 'event'), can('retrieve', 'company'), retrieve(models.CompanyEvent, { event_id: 'event_id' }));
    patch('/events/:event_id/bookmarks', can('create', 'event'), can('update', 'event'), upsert(models.EventBookmark, ['event_id']));
    get('/events/:event_id/bookmarks/:id?', can('retrieve', 'event'), retrieve(models.EventBookmark, { event_id: 'event_id', user_id: 'id' }));
    del('/events/:event_id/bookmarks/:id', can('delete', 'event'), remove(models.EventBookmark, { event_id: 'event_id', user_id: 'id' }));
    get('/search/products/en-US', can('retrieve', 'product'), like(models.Product, 'en-US'));
    get('/search/tags/en-US', can('retrieve', 'tag'), like(models.Tag, 'en-US'));
    get('/search/companies/name', can('retrieve', 'company'), like(models.Company, 'name'));
    app.use(function (err, req, res, next) {
        console.error(err);
        res.status(500);
        res.json({
            meta: {
                ok: false,
                error: true,
                error_msg: err.message
            },
            body: {}
        });
    });
};
