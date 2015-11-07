'use strict';

var firebase, elasticsearch;

var Firebase = require('firebase');
var ElasticsearchClient = require('elasticsearchclient');

var config = require('acm'),
    debug = require('debug'),
    log = debug('service');

var indexer = require('./src/indexer'),
    searcher = require('./src/searcher');

var es_config = {
    host: config('elasticsearch.host')
};

log('firebase application %s', config('firebase.url'));
log('elasticsearch host %s', config('elasticsearch.host'));

if (config('elasticsearch.port')) {
    es_config.port = config('elasticsearch.port');
    log('elasticsearch port %s', config('elasticsearch.port'));
} else {
    log('no elasticsearch port');
}

firebase = new Firebase(config('firebase.url'));
elasticsearch = new ElasticsearchClient(es_config);

log('starting indexer and searcher jobs');
indexer(elasticsearch, firebase, 'user', ['fullName']);
indexer(elasticsearch, firebase, 'company', ['name', 'summary']);
searcher(elasticsearch, firebase);
