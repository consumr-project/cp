'use strict';

var firebase, elasticsearch;

var Firebase = require('firebase');
var ElasticsearchClient = require('elasticsearchclient');

var config = require('acm'),
    debug = require('debug'),
    log = debug('service');

var indexer = require('./src/indexer'),
    searcher = require('./src/searcher');

log('firebase application %s', config('firebase.url'));
log('elasticsearch host %s', config('elasticsearch.host'));
log('elasticsearch port %s', config('elasticsearch.port'));

firebase = new Firebase(config('firebase.url'));
elasticsearch = new ElasticsearchClient({
    host: config('elasticsearch.host'),
    port: config('elasticsearch.port')
});

log('starting indexer and searcher jobs');
indexer(elasticsearch, firebase, 'user', ['fullName']);
indexer(elasticsearch, firebase, 'company', ['name', 'summary']);
searcher(elasticsearch, firebase);
