import { head } from 'lodash';
import { Client } from 'elasticsearch';
import { DatabaseConnection } from 'cp/service';
import { UUID } from 'cp/lang';
import { scalar } from '../lang';
import { sql } from '../record/query';

const debug = require('debug')('cp:search:updater');
const query = sql('sync');

export class LinkDefinition {
    constructor(public name: string, public fields: string[] = [],
        public soft_delete = true, public field_primary_key = 'id',
        public field_label = 'name') {}
}

interface EntryDefinition {
    __id: UUID;
    __deleted: boolean;
    __label: string;
    [field: string]: scalar;
}

interface UpdateOptions {
    since: Date | number;
}

function gen_query(db: DatabaseConnection, def: LinkDefinition): string {
    var fields = [
        def.field_primary_key ? `${def.field_primary_key} as __id` : '',
        def.soft_delete ? 'deleted_date is not null as __deleted' : '',
        def.field_label ? `${def.field_label} as __label` : '',
    ].concat(def.fields).filter(x => !!x);

    return query({
        name: def.name,
        fields: fields,
    });
}

export function get(db: DatabaseConnection, def: LinkDefinition, opt: UpdateOptions) {
    var since = opt.since instanceof Date ? opt.since :
        new Date(Date.now() - opt.since.valueOf());

    var query = gen_query(db, def);

    return new Promise<EntryDefinition[]>((resolve, reject) => {
        db.query(query, { replacements: { since } })
            .then(head)
            .then((rows: EntryDefinition[]) => {
                debug('found %s %s', rows.length, def.name);
                resolve(rows);
            })
            .catch(err => {
                console.error('error running query for %s. %s', def.name, err.stack);
                reject(err);
            });
    });
}

export function elasticsearch(es: Client, def: LinkDefinition, rows: EntryDefinition[]) {
    return new Promise<number>((resolve, reject) => {
        resolve(1);
    });
}
