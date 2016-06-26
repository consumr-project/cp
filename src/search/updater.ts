import { head } from 'lodash';
import { Client } from 'elasticsearch';
import { DatabaseConnection } from 'cp/service';

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

    return `
        select ${fields.join(', ')}
        from ${def.name}
        where updated_date > :since`;
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
                console.log(rows);
                resolve(rows.length);
            })
            .catch(err => {
                console.error(err);
                reject(err);
            });
    });
}
