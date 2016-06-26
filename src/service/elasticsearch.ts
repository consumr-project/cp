import { Client } from 'elasticsearch';
import config = require('acm');

export default (c = config) =>
    new Client({
        host: c('elasticsearch.host')
    });
