'use strict';

var conn, models, api;

var Sequelize = require('sequelize'),
    DataTypes = require('sequelize/lib/data-types');

var body = require('body-parser'),
    crud = require('./src/crud'),
    utils = require('./src/utils'),
    debug = require('debug');

var app = require('express')(),
    config = require('acm'),
    log = debug('service:query');

conn = new Sequelize(config('database.url'), {
    logging: debug('service:query:exec'),
    pool: config('database.pool')
});

models = {
    Company: model('company'),
    CompanyFollower: model('company_followers'),
    Event: model('event'),
    Source: model('source'),
    Tag: model('tag'),
    User: model('user'),
};

app.use(body.json());

app.post('/users', crud.create(models.User));
app.get('/users/:id', crud.retrieve(models.User));

app.post('/companies', crud.create(models.Company));
app.get('/companies/:id?', crud.retrieve(models.Company));
app.put('/companies/:id', crud.update(models.Company));
app.delete('/companies/:id', crud.delete(models.Company));

app.post('/companies/:company_id/followers', crud.create(models.CompanyFollower, ['company_id']));
// app.get('/companies/:company_id/followers/:id?', crud.retrieve(models.CompanyFollower, ['company_id']));
// app.delete('/companies/:company_id/followers/:id', crud.delete(models.CompanyFollower, ['company_id']));

log('starting sync');
conn.sync().then(function () {
    log('sync complete');

    if (!module.parent) {
        log('starting server');
        app.listen(config('port') || 3000);
    }
});

/**
 * @param {String} name
 * @return {Sequelize.Model}
 */
function model(name) {
    return require('./db/models/' + name)(conn, require('sequelize/lib/data-types'));
}

module.exports = app;
module.exports.conn = conn;
module.exports.models = models;
