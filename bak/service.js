'use strict';

/**
 * process.env.NEW_RELIC_NO_CONFIG_FILE = true;
 * require('newrelic');
 */
const Elasticsearch = require('elasticsearch').Client;

const User = require('query-service').models.User;
const Company = require('query-service').models.Company;

const debug = require('debug');
const config = require('acm');

const replicator = require('./src/replicator');
const indexer = require('./src/indexer');

var log = debug('service:search');
var es = new Elasticsearch({ host: config('elasticsearch.host') });

// XXX bit of a hack, but this is the only way that I can reference the local
// copy of `config/rbac.yml`
config.ref.$paths.push(require('path').join(__dirname, 'config'));

log('elasticsearch host %s', config('elasticsearch.host'));
log('starting indexer job');
// indexer(elasticsearch, firebase, 'user', ['fullName']);
// indexer(elasticsearch, firebase, 'company', ['name', 'summary']);

replicator.schedule(User, replicator.EVERY.HOUR, indexer);
replicator.schedule(Company, replicator.EVERY.HOUR, indexer);
