'use strict';

var crud = require('./crud');

module.exports = function (app, models) {
    var post = app.post.bind(app),
        get = app.get.bind(app),
        put = app.put.bind(app),
        del = app.delete.bind(app),
        patch = app.patch.bind(app);

    var create = crud.create,
        retrieve = crud.retrieve,
        update = crud.update,
        remove = crud.delete,
        upsert = crud.upsert,
        like = crud.like;

    // users
    post('/users', create(models.User));
    get('/users/:id', retrieve(models.User));

    // tags
    get('/tags/:id?', retrieve(models.Tag));

    // companies
    post('/companies', create(models.Company));
    get('/companies/:id?', retrieve(models.Company));
    put('/companies/:id', update(models.Company));
    del('/companies/:id', remove(models.Company));

    patch('/companies/:company_id/followers', upsert(models.CompanyFollower, ['company_id']));
    get('/companies/:company_id/followers/:id?', retrieve(models.CompanyFollower, {company_id: 'company_id', user_id: 'id'}));
    del('/companies/:company_id/followers/:id', remove(models.CompanyFollower, {company_id: 'company_id', user_id: 'id'}));

    patch('/companies/:company_id/events', upsert(models.CompanyEvent, ['company_id']));
    get('/companies/:company_id/events/:id?', retrieve(models.CompanyEvent, {company_id: 'company_id', event_id: 'id'}));
    del('/companies/:company_id/events/:id', remove(models.CompanyEvent, {company_id: 'company_id', event_id: 'id'}));

    // events
    post('/events', create(models.Event));
    patch('/events', upsert(models.Event));
    get('/events/:id?', retrieve(models.Event));
    del('/events/:id', remove(models.Event));

    patch('/events/:event_id/sources', upsert(models.EventSource, ['event_id']));
    get('/events/:event_id/sources/:id?', retrieve(models.EventSource, {event_id: 'event_id'}));

    patch('/events/:event_id/tags', upsert(models.EventTag, ['event_id']));
    get('/events/:event_id/tags/:id?', retrieve(models.EventTag, {event_id: 'event_id'}));

    // search
    get('/search/tags/en-US', like(models.Tag, 'en-US'));
    get('/search/companies/name', like(models.Company, 'name'));
};
