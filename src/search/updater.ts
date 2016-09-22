import { merge, head, filter, pick } from 'lodash';
import { Client, Index } from 'elasticsearch';
import { DatabaseConnection } from '../device/dbms';
import { INDEX } from './searcher';
import { sql } from '../record/query';
import { logger } from '../log';

import { GetterFunction, UpdaterFunction, EntryDefinition, GetterOptions,
    LinkDefinition, UpdaterAck } from '../river/sync';

const log = logger(__filename);
const query = sql('sync');

function gen_query(db: DatabaseConnection, def: LinkDefinition): string {
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

export const get: GetterFunction = function get(
    db: DatabaseConnection,
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
                console.error('error running query for %s. %s',
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

        es.bulk({
            body: rows.reduce((edit, row) => {
                if (row.__deleted) {
                    edit.push({ delete: gen_index(def, row) });
                } else if (row.__created) {
                    edit.push({ index: gen_index(def, row) });
                    edit.push(merge({__label: row.__label}, pick(row, def.fields)));
                } else {
                    edit.push({ update: gen_index(def, row) });
                    edit.push({ doc: merge({__label: row.__label}, pick(row, def.fields)) });
                }

                return edit;
            }, [])
        })
            .then(ack => {
                log.debug('done pushing updates to %s', def.name);
                log.debug('took: %s, errors: %s', ack.took, ack.errors);
                resolve({ ok: !ack.errors, def });
            })
            .catch(err => {
                console.error('error running elasticsearch update for %s. %s',
                    def.name, err.stack);

                reject(err);
            });
    });
};
