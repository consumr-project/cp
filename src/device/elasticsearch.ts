import { Client } from 'elasticsearch';
import * as config from 'acm';

export type ElasticsearchDevice = Client;

export default (c = config) =>
    new Client({
        apiVersion: c('elasticsearch.api_version'),
        host: c('elasticsearch.host')
    });
