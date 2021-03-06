import { UUID } from '../lang';
import { clone } from 'lodash';
import { Collection, FindAndModifyWriteOpResultObject, UpdateWriteOpResult,
    DeleteWriteOpResultObject } from 'mongodb';

import Message, { CATEGORY, NOTIFICATION } from '../notification/message';

export function update(coll: Collection, ids: UUID[], update: Object): Promise<UpdateWriteOpResult> {
    return coll.updateMany({ id: { $in: ids } }, update);
}

export function save(coll: Collection, message: Message): Promise<FindAndModifyWriteOpResultObject> {
    let upsert = true;
    let signature = message.signature;
    return coll.findOneAndUpdate({ signature }, message, { upsert });
}

export function purge(coll: Collection, id: UUID): Promise<DeleteWriteOpResultObject> {
    return coll.deleteOne({id});
}

export function purge_signature(coll: Collection, signature: string): Promise<DeleteWriteOpResultObject> {
    return coll.deleteOne({signature});
}

export function find(
    coll: Collection,
    to: UUID,
    category: CATEGORY,
    subcategories: NOTIFICATION[] = [],
    query: any = {}
): Promise<Message[]> {
    query = clone(query);

    if (!Object.keys(query).length) {
        query.to = to;
        query.category = category;
        query.subcategory = { $in: subcategories };
    }

    return coll.find(query).toArray();
}
