import { Cache, Item } from 'cp/cache';
import { Collection } from 'mongodb';
import { ServiceRequestHandler, service_response } from './http';

const IDX_COLL = { expire_at: 1 };
const IDX_CONF = { expireAfterSeconds: 0 };

function gen_item<T>(name, value, ttl): Item<T> {
    return { name, value, expire_at: new Date(Date.now() + ttl) };
}

export function shared(coll: Collection): Cache<Object> {
    coll.createIndex(IDX_COLL, IDX_CONF);

    return {
        get: function (name) {
            return new Promise((resolve, reject) => {
                coll.find({ name })
                    .next()
                    .then(item => resolve(item ? item.value : undefined))
                    .catch(reject);
            });
        },

        set: function (name, value, { ttl = 3600000 }) {
            return new Promise<boolean>((resolve, reject) => {
                var filter = { name },
                    update = gen_item(name, value, ttl),
                    option = { upsert: true };

                coll.findOneAndUpdate(filter, update, option)
                    .then(() => resolve(true))
                    .catch(reject);
            });
        },
    };
}

export function quick_save<T>(cache: Cache<T>, name: string): (val: T) => T {
    return val => {
        cache.set(name, val, {});
        return val;
    };
}

export function service_cache_intercept<T>(cache: Cache<T>, name: string): ServiceRequestHandler {
    return (req, res, next) => {
        cache.get(name)
            .then(rec => rec ? res.json(service_response(rec, true, { from_cache: true })) : next())
            .catch(next);
    };
}
