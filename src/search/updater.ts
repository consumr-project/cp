import { head } from 'lodash';
import { Client } from 'elasticsearch';
import { DatabaseConnection } from 'cp/service';
import { sql } from '../record/query';

const debug = require('debug')('cp:search:updater');
const query = sql('sync');

export class LinkDefinition {
    constructor(public name: string, public fields: string[] = [],
        public soft_delete = true, public field_primary_key = 'id',
        public field_label = 'name') {}
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

export function update(es: Client, db: DatabaseConnection, def: LinkDefinition,
    opt: UpdateOptions) {

    var since = opt.since instanceof Date ? opt.since :
        new Date(Date.now() - opt.since.valueOf());

    var query = gen_query(db, def);

    return new Promise<number>((resolve, reject) => {
        db.query(query, { replacements: { since } })
            .then(head)
            .then((rows: {}[]) => {
                debug('got back %s rows for %s definition', rows.length, def.name);
                resolve(rows.length);
            })
            .catch(err => {
                console.error(err);
                reject(err);
            });
    });
}
