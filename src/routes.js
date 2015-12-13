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
        upsert = crud.upsert;

    // users
    post('/users', create(models.User));
    get('/users/:id', retrieve(models.User));

    // companies
    post('/companies', create(models.Company));
    get('/companies/:id?', retrieve(models.Company));
    put('/companies/:id', update(models.Company));
    del('/companies/:id', remove(models.Company));

    post('/companies/:company_id/followers', create(models.CompanyFollower, ['company_id']));
    patch('/companies/:company_id/followers', upsert(models.CompanyFollower, ['company_id']));
    get('/companies/:company_id/followers/:id?', retrieve(models.CompanyFollower, {company_id: 'company_id', user_id: 'id'}));
    del('/companies/:company_id/followers/:id', remove(models.CompanyFollower, {company_id: 'company_id', user_id: 'id'}));

    // events
    patch('/companies/:company_id/events', upsert(models.CompanyEvent, ['company_id']));
    get('/companies/:company_id/events/:id?', retrieve(models.CompanyEvent, {company_id: 'company_id'}));

    patch('/companies/:company_id/events/:event_id/sources', upsert(models.CompanyEventSource, ['event_id']));
    get('/companies/:company_id/events/:event_id/sources/:id?', upsert(models.CompanyEventSource, {event_id: 'event_id'}));

    // patch('/companies/:company_id/events/:event_id/tags', upsert(models.CompanyEventTag, ['event_id']));
    // get('/companies/:company_id/events/:event_id/tags/:id?', upsert(models.CompanyEventTag, {event_id: 'event_id'}));
};
