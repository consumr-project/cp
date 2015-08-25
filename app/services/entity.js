(function (store) {
    'use strict';

    /* global Q */

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

    store.get = get;
})(typeof window !== 'undefined' ? window.entity = {} : module.exports);
