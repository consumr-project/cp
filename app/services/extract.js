'use strict';

/* global api, _ */

(function (store) {
    /**
     * extract a page's content
     * @param {String} url
     * @return {Promise<Object>}
     */
    function fetch(url) {
        return api.get('/extract', { url: url })
            .then(normalize)
            .then(clean);
    }

    /**
     * takes a api response object and returns a normalize article object
     * @param {Object} res
     * @return {Object}
     */
    function normalize(res) {
        var article = res && res.response ? res.response : {};

        return {
            ok: res && res.status === 'success',
            content: article.content || '',
            images: article.images || [],
            source: article.source || '',
            title: article.title || ''
        };
    }

    /**
     * removes unnecessary lines from article contents
     * @param {Object} res
     * @return {Object}
     */
    function clean(article) {
        var sections = article.content.split('\n');

        sections = _.filter(sections, function (section, index) {
            switch (_.trim(section).toLowerCase()) {
                case 'subscribe':
                case 'loading...':
                case 'advertisement':
                case 'photo':
                case 'preface':
                case 'supported by':
                case 'continue reading the main story':
                    return false;
            }

            return true;
        });

        article.content = sections.join('\n\n');
        return article;
    }

    store.fetch = fetch;
})(typeof window !== 'undefined' ? window.extract = {} : module.exports);
