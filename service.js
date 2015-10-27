'use strict';

var firebase, elasticsearch;

var Firebase = require('firebase');
var ElasticsearchClient = require('elasticsearchclient');

var config = require('acm');
var log = require('debug')('service');
var indexer = require('./src/indexer');

log('firebase application %s', config('firebase.url'));
log('elasticsearch host %s', config('elasticsearch.host'));
log('elasticsearch port %s', config('elasticsearch.port'));

firebase = new Firebase(config('firebase.url'));
elasticsearch = new ElasticsearchClient({
    host: config('elasticsearch.host'),
    port: config('elasticsearch.port')
});

indexer(elasticsearch, firebase, 'company', ['name', 'summary']);
