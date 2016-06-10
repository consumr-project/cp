import { UUID } from 'cp/lang';
import { Collection, InsertOneWriteOpResult } from 'mongodb';
import { clone } from 'lodash';

import Message, { CATEGORY, SUBCATEGORY } from './message';

export function save(coll: Collection, message: Message): Promise<InsertOneWriteOpResult> {
    return coll.insertOne(message);
}

export function find(
    coll: Collection,
    to: UUID,
    category: CATEGORY,
    subcategories: SUBCATEGORY[] = [],
    query: any = {}
): Promise<Message[]> {
    query = clone(query);
    query.to = to;
    query.category = category;
    query.subcategory = { $in: subcategories };

    return coll.find(query).toArray();
}
