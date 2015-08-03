(function (store) {
    'use strict';

    /* global reqwest, _, utils */

    var api_url = 'http://api.embed.ly/1/extract?',
        api_key = 'a219d61c774a44b9b0b414d69b0df88d';

    var node = document.createElement('div');

    var microsoft_extensions = ['doc', 'docx', 'xlsx', 'pptx'];

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
        })
            .then(normalize)
            .then(microsoft_media);
    }

    /**
     * updates article object to work as a microsoft document
     * @param {Object} article
     * @return {Object}
     */
    function microsoft_media(article) {
        if (!article.type && is_microsoft_extension(article.url)) {
            article.media = {
                type: store.TYPE_RICH,
                html: utils.html('iframe', {
                    src: 'https://view.officeapps.live.com/op/view.aspx?src=' +
                        article.url
                })
            };
        }

        return article;
    }

    function is_microsoft_extension(name) {
        var ext_index = _.lastIndexOf(name, '.'),
            ext = name.substr(ext_index + 1);

        return microsoft_extensions.indexOf(ext) !== -1;
    }

    /**
     * article content cleanup and nomalization
     * @param {Object} article
     * @return {Object}
     */
    function normalize(article) {
        node.innerHTML = article.content || article.description;

        article.orig_content = article.content;
        article.orig_images = article.images;
        article.orig_keywords = article.keywords;

        article.content = _.trim(node.innerText);
        article.contentParts = article.content.split('\n');
        article.keywords = _.pluck(article.keywords, 'name');

        article.images = _(article.images).filter(function (article) {
            return article.width > 500;
        }).pluck('url').uniq().value();

        return article;
    }

    store.fetch = fetch;

    store.TYPE_VIDEO = 'video';
    store.TYPE_ARTICLE = 'article';
    store.TYPE_PHOTO = 'photo';
    store.TYPE_RICH = 'rich';
    store.TYPE_ERROR = 'error';
})(typeof window !== 'undefined' ? window.extract = {} : module.exports);
