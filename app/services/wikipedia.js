(function (store) {
    'use strict';

    /* global reqwest, Q, _ */
    var url = 'https://en.wikipedia.org/w/api.php?';

    var extract_logo = /Infobox[\s+\S+]+\|\s?logo\s{0,}=\s{0,}\[{0,}(.+:[-\w\d\s.]+)/,
        extract_image = /Infobox[\s+\S+]+\|\s?image\s{0,}=\s{0,}\[{0,}(.+:[-\w\d\s.]+)/;

    var extract_delim = '\n',
        extract_ref = '^';

    /**
     * @param {Object}
     * @return {String}
     */
    function stringify(params) {
        return _.map(params, function (val, key) {
            return [key, encodeURIComponent(val)].join('=');
        }).join('&');
    }

    /**
     * make a call to wikipedia's api
     * @param {Object} params
     * @return {Promise}
     */
    function api(params) {
        params.format = 'json';
        params.callback = 'JSON_CALLBACK';

        return reqwest({
            type: 'jsonp',
            url: url + stringify(params)
        });
    }

    /**
     * @param {String} line
     * @return {Boolean}
     */
    function isNotReference(line) {
        return line && line.charAt(0) !== extract_ref;
    }

    /**
     * @param {String} object name of object you want to get out of
     * res.data.query response object
     * @return {Function} function that get's that object once called
     */
    function best(object) {
        return function (res) {
            var all = res.query[object],
                best = {};

            for (var id in all) {
                if (!all.hasOwnProperty(id)) {
                    continue;
                }

                best = all[id];
                best._matches = all;

                // extract without references
                best.extract_no_refs = best.extract && _.filter(best.extract.split(extract_delim),
                    isNotReference).join(extract_delim);

                best.extract_no_ref_parts = !best.extract_no_refs ? [] :
                    best.extract_no_refs.split(extract_delim);

                break;
            }

            return best;
        };
    }

    /**
     * extract a page's description
     * @param {String} title
     * @return {Promise<Object>}
     */
    function extract(title) {
        return api({
            action: 'query',
            prop: 'extracts',
            exintro: '',
            explaintext: '',
            titles: title,
        }).then(best('pages'));
    }

    /**
     * get a page's revisions
     * @param {String} title
     * @return {Promise<Object>}
     */
    function revisions(title) {
        return api({
            action: 'query',
            prop: 'revisions',
            rvprop: 'content',
            titles: title
        }).then(best('pages'));
    }

    /**
     * get an image's/file's information (url)
     * @param {String} file
     * @return {Promise<Object>}
     */
    function imageinfo(file) {
        return api({
            action: 'query',
            prop: 'imageinfo',
            iiprop: 'url',
            titles: file
        }).then(best('pages'));
    }

    /**
     * get a page's main image
     * @param {String} title
     * @return {Promise<Object>}
     */
    function image(title) {
        var def = Q.defer(),
            req = revisions(title);

        function revolveWithUrl(res) {
            def.resolve(res.imageinfo ? res.imageinfo[0].url : null);
        }

        req.then(function (res) {
            var file;

            if (!res || !res.revisions) {
                def.resolve(null);
                return;
            }

            file = res.revisions[0]['*'].match(extract_logo) ||
                   res.revisions[0]['*'].match(extract_image);

            if (!file) {
                def.resolve(null);
                return;
            }

            file = file[1]
                .replace(/ /g, '_')
                .replace(/\s/g, '');

            return imageinfo(file)
                .then(revolveWithUrl);
        });

        return def.promise;
    }

    store.extract = extract;
    store.revisions = revisions;
    store.imageinfo = imageinfo;
    store.image = image;
})(typeof window !== 'undefined' ? window.wikipedia = {} : module.exports);
