import db_connect from '../service/dbms';
import es_connect from '../service/elasticsearch';
import { LinkDefinition, update } from '../search/updater';
import { Minute } from '../lang';

const log = require('debug')('worker:river');
const db = db_connect();
const es = es_connect();

const config = require('acm');
const models = config('river.models').map(def =>
    new LinkDefinition(def.name, def.fields, def.soft_delete,
        def.primary_key, def.label));

models.map(model => log(model));
export default function () {
    models.map(model => {
        update(es, db, model, {
            since: Minute * 60 * 10000
        });
    });
};
