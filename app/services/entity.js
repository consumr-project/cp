(function (store) {
    'use strict';

    /* global Q, utils, _ */

    /**
     * @param {Object} entity
     * @param {String} id
     * @return {Object}
     */
    function tag(entity, id) {
        entity.__id = id;
        return entity;
    }

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
     * @param {String|Object} guid|search
     * @return {Promise}
     */
    function get(store, guid) {
        var def = Q.defer(),
            search;

        if (_.isPlainObject(guid)) {
            search = store.orderByChild('guid');
            _.map(guid, function (val, key) {
                search = store
                    .orderByChild(key)
                    .equalTo(val);
            });
        } else {
            search = store
                .orderByChild('guid')
                .equalTo(guid)
                .limitToFirst(1);
        };

        search.on('value', function (res) {
            var entity = res.val(),
                id = _.keys(entity)[0];

            if (!entity) {
                return;
            }

            def.resolve(
                _.isPlainObject(guid) ?
                _.map(entity, tag) :
                tag(entity[id], id)
            );
        });

        return def.promise;
    }

    store.upsert = upsert;
    store.get = get;
})(typeof window !== 'undefined' ? window.entity = {} : module.exports);
