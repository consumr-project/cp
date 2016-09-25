import { merge, head, filter, pick } from 'lodash';
import { Client, Index } from 'elasticsearch';
import { DbmsDevice } from '../device/dbms';
import { ElasticsearchBulkUpdateError } from '../device/elasticsearch';
import { INDEX } from './searcher';
import { sql } from '../record/query';
import { logger } from '../log';

import { GetterFunction, UpdaterFunction, EntryDefinition, GetterOptions,
    LinkDefinition, UpdaterAck } from '../river/sync';

const log = logger(__filename);
const query = sql('sync');

function gen_query(db: DbmsDevice, def: LinkDefinition): string {
    var fields = [
        def.field_primary_key ? `${def.field_primary_key} as __id` : '',
        def.soft_delete ? 'deleted_date is not null as __deleted' : '',
        def.soft_delete ? 'created_date >= :since as __created' : '',
        def.field_label ? `${def.field_label} as __label` : '',
    ].concat(def.fields).filter(x => !!x);

    return query({
        name: def.name,
        fields: fields,
    });
}

function gen_index(def: LinkDefinition, row: EntryDefinition): Index {
    return {
        _index: INDEX.RECORD.toString(),
        _type: def.name,
        _id: row.__id,
    };
}

function append<T>(list: string[], row: T): void {
    list.push(JSON.stringify(row));
}

function prep_body(body: string[]): string {
    return body.join('\n') + '\n';
}

export const get: GetterFunction = function get(
    db: DbmsDevice,
    def: LinkDefinition,
    opt: GetterOptions
) {
    var since = opt.since instanceof Date ? opt.since :
        new Date(Date.now() - opt.since.valueOf());

    var query = gen_query(db, def);

    return new Promise<EntryDefinition[]>((resolve, reject) => {
        db.query(query, { replacements: { since } })
            .then(head)
            .then((rows: EntryDefinition[]) => {
                log.debug('found %s %s', rows.length, def.name);
                resolve(rows);
            })
            .catch(err => {
                log.error('error running query for %s. %s',
                    def.name, err.stack);

                reject(err);
            });
    });
};

export const elasticsearch: UpdaterFunction = function elasticsearch(
    es: Client,
    def: LinkDefinition,
    rows: EntryDefinition[]
) {
    return new Promise<UpdaterAck>((resolve, reject) => {
        var to_delete = filter(rows, { __deleted: true }),
            to_create = filter(rows, { __deleted: false, __created: true }),
            to_update = filter(rows, { __deleted: false, __created: false });

        log.debug('bulk elasticsearch edit');
        log.debug('creating %s %s', to_create.length, def.name);
        log.debug('updating %s %s', to_update.length, def.name);
        log.debug('deleting %s %s', to_delete.length, def.name);

        if (!rows.length) {
            return resolve({ ok: true, def });
        }

        es.bulk({
            body: prep_body(rows.reduce((edit, row) => {
                if (row.__deleted) {
                    append(edit, {
                        delete: gen_index(def, row)
                    });
                } else {
                    append(edit, {
                        index: gen_index(def, row)
                    });

                    append(edit, merge({
                        __label: row.__label
                    }, pick(row, def.fields)));
                }

                return edit;
            }, []))
        })
            .then(ack => {
                if (ack.errors) {
                    throw new ElasticsearchBulkUpdateError(def.name, ack);
                }

                log.debug('done pushing updates to %s', def.name);
                log.debug('took: %s, errors: %s', ack.took, ack.errors);
                resolve({ ok: !ack.errors, def });
            })
            .catch(ElasticsearchBulkUpdateError, err => {
                log.error('error making bulk update', err.ack.items);
                reject(err);
            })
            .catch(err => {
                log.error(err);
                log.error('error running elasticsearch update for %s. %s',
                    def.name, err.stack);

                reject(err);
            });
    });
};
