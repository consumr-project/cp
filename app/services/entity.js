(function (store) {
    'use strict';

    /* global Q, _ */

    var FIELD_CREATED_DATE = 'createdDate',
        FIELD_MODIFIED_DATE = 'modifiedDate',
        FIELD_GUID = 'guid';

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
     * @return {Promise}
     */
    function put(store, data) {
        var def = Q.defer(),
            now = (new Date()).valueOf(),
            ref;

        if (!data[FIELD_GUID]) {
            def.reject(new Error('Missing required property: ' + FIELD_GUID));
        } else {
            ref = store.child(data[FIELD_GUID]);

            _.each(data, function (val, key) {
                ref.child(key).set(val);
            });

            ref.child(FIELD_CREATED_DATE).set(data.createdDate || now);
            ref.child(FIELD_MODIFIED_DATE).set(now, function (err) {
                if (err) {
                    def.reject(err);
                } else {
                    def.resolve(ref);
                }
            });
        }
    }

    store.get = get;
    store.put = put;
})(typeof window !== 'undefined' ? window.entity = {} : module.exports);
