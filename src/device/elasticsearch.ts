import { Ack, Client } from 'elasticsearch';
import * as config from 'acm';

export type ElasticsearchDevice = Client;

export class ElasticsearchBulkUpdateError extends Error {
    ack: Ack;

    constructor(def_name: string, ack: Ack) {
        super();
        this.message = `Error running bulk update for "${def_name}" definition.`;
        this.ack = ack;
    }
}

export default (c = config) =>
    new Client({
        apiVersion: c('elasticsearch.api_version'),
        host: c('elasticsearch.host')
    });
