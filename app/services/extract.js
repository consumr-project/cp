(function (store) {
    'use strict';

    /* global reqwest, _ */

    var api_url = 'http://api.embed.ly/1/extract?',
        api_key = 'a219d61c774a44b9b0b414d69b0df88d';

    var node = document.createElement('div');

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
     * @param {String} url
     * @return {Promise}
     */
    function fetch(url) {
        return reqwest({
            type: 'jsonp',
            url: api_url + stringify({
                callback: 'JSON_CALLBACK',
                key: api_key,
                maxheight: 1000,
                maxwidth: 1000,
                url: url
            })
        }).then(function (article) {
            node.innerHTML = article.content;

            article.orig_content = article.content;
            article.orig_images = article.images;
            article.orig_keywords = article.keywords;

            article.content = _.trim(node.innerText);
            article.contentParts = article.content.split('\n');
            article.keywords = _.pluck(article.keywords, 'name');

            article.images = _(article.images).filter(function (article) {
                return article.width > 500;
            }).pluck('url').uniq().value();
            // _.pluck(article.images, 'url');

            return article;
        });
    }

    store.fetch = fetch;
})(typeof window !== 'undefined' ? window.extract = {} : module.exports);
