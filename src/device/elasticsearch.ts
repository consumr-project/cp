import { Client } from 'elasticsearch';
import * as config from 'acm';

export class ElasticsearchDevice extends Client {}

export default (c = config) =>
    new ElasticsearchDevice({
        host: c('elasticsearch.host')
    });
