(function (store) {
    'use strict';

    /* global Q, _ */

    /**
     * @param {Firebase} store
     * @param {String|Object} guid|search
     * @return {Promise}
     */
    function get(store, guid) {
        var def = Q.defer();
        store.child(guid).once('value', def.resolve, def.reject);
        return def.promise;
    }

    /**
     * @param {Firebase} store
     * @param {Object} data
     * @param {Array} [fields]
     * @return {Promise}
     */
    function put(store, data, fields) {
        var def = Q.defer(),
            now = (new Date()).valueOf(),
            ref;

        fields = fields || _.keys(data);

        if (!data.guid) {
            def.reject(new Error('Missing required property: guid'));
        } else {
            ref = store.child(data.guid);

            _.each(fields, function (field) {
                ref.child(field).set(data[field] || '');
            });

            ref.child('modifiedDate').set(now, function (err) {
                if (err) {
                    def.reject(err);
                } else {
                    def.resolve(ref);
                }
            });

            if (!data.createdDate) {
                ref.child('createdDate').once('value', function (createdDate) {
                    if (!createdDate.val()) {
                        ref.child('createdDate').set(now);
                    }
                });
            } else {
                ref.child('createdDate').set(data.createdDate);
            }
        }

        return def.promise;
    }

    store.get = get;
    store.put = put;
})(typeof window !== 'undefined' ? window.entity = {} : module.exports);
