(function (store) {
    'use strict';

    /* global Q, utils */

    /**
     * @param {Firebase} store
     * @param {Object} entity
     * @return {Promise}
     */
    function upsert(store, entity) {
        var def = Q.defer(),
            push;

        if (entity.__id) {
            store
                .child(entity.__id)
                .update(entity, def.resolve);
        } else {
            if (!entity.guid && (entity.name || entity.title)) {
                entity.guid = utils.semiguid(entity.name || entity.title);
            }

            push = store.push(entity, function () {
                entity.__id = push.key();
                def.resolve(entity);
            });
        }

        return def.promise;
    }

    /**
     * @param {Firebase} store
     * @param {String} guid
     * @return {Promise}
     */
    function get(store, guid) {
        var def = Q.defer();

        store
            .orderByChild('guid')
            .equalTo(guid)
            .limitToFirst(1)
            .on('child_added', function (res) {
                var entity = res.val();
                entity.__id = res.key();
                def.resolve(entity);
            });

        return def.promise;
    }

    store.upsert = upsert;
    store.get = get;
})(typeof window !== 'undefined' ? window.entity = {} : module.exports);
