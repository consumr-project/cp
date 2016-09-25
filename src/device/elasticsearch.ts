import { Ack, Client } from 'elasticsearch';
import { logger } from '../log';
import * as config from 'acm';

const log = logger(__filename);
export type ElasticsearchDevice = Client;

export class ElasticsearchBulkUpdateError extends Error {
    ack: Ack;

    constructor(def_name: string, ack: Ack) {
        super();
        this.message = `Error running bulk update for "${def_name}" definition.`;
        this.ack = ack;
    }
}

export default (c = config): Client => {
    var api = c('elasticsearch.api_version');
    var host = c('elasticsearch.host');

    log.debug('connecting to elasticsearch (%s) running on %s', api, host);

    return new Client({ host, apiVersion: api });
};
