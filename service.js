'use strict';

process.env.NEW_RELIC_NO_CONFIG_FILE = true;
require('newrelic');

var firebase, elasticsearch;

var Firebase = require('firebase');
var Elasticsearch = require('elasticsearch').Client;

var config = require('acm'),
    debug = require('debug'),
    log = debug('service');

var indexer = require('./src/indexer');

log('firebase application %s', config('firebase.url'));
log('elasticsearch host %s', config('elasticsearch.host'));

firebase = new Firebase(config('firebase.url'));
elasticsearch = new Elasticsearch({ host: config('elasticsearch.host') });

log('starting indexer job');
indexer(elasticsearch, firebase, 'user', ['fullName']);
indexer(elasticsearch, firebase, 'company', ['name', 'summary']);
