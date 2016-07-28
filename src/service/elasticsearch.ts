import { Client } from 'elasticsearch';
import * as config from 'acm';

export default (c = config) =>
    new Client({
        host: c('elasticsearch.host')
    });
