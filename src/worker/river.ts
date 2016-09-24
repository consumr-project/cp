import db_connect, { DbmsDevice } from '../device/dbms';
import es_connect, { ElasticsearchDevice } from '../device/elasticsearch';
import { get, elasticsearch } from '../search/updater';
import { UpdaterAck, LinkConfiguration, LinkDefinition } from '../river/sync';
import { Duration } from '../lang';
import { logger } from '../log';
import { nonce } from '../crypto';
import * as config from 'acm';

const log = logger(__filename);
const models: LinkDefinition[] = config('river.models').map((def: LinkConfiguration) =>
    new LinkDefinition(def.name, def.fields, def.soft_delete,
        def.primary_key, def.label));

export function run(since: Duration, identity: string, counter: number): Promise<UpdaterAck[]> {
    var db: DbmsDevice;
    var es: ElasticsearchDevice;

    try {
        db = db_connect();
        es = es_connect();

        models.map(model => log.info('river model entry', model));

        return Promise.all(models.map(model => get(db, model, { since })
            .then(rows => elasticsearch(es, model, rows))
            .then(ack => {
                log.info('done updating %s', model.name);
                return ack;
            })
        ))
            .then(acks => {
                db.close();
                log.info('completed river', { identity, counter });
                return acks;
            })
            .catch(err => {
                log.error('error running river', { identity, counter, err });
                throw err;
            });
    } catch (err) {
        log.error('error running river', { identity, counter, err });
    }
}

export function interval(since: Duration): NodeJS.Timer {
    let wait_time = since * .9;
    let identity = nonce(5);
    let counter = 0;

    let wrapped_run = () => run(since, identity, ++counter);

    log.info('registering river timer', { identity, wait_time });
    wrapped_run();
    return setInterval(wrapped_run, wait_time);
}
