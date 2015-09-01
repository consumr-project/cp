(function (store) {
    'use strict';

    /* global TCP_BUILD_CONFIG, reqwest, _, utils */

    var api_url = 'http://api.embed.ly/1/extract?',
        api_key = TCP_BUILD_CONFIG.embedly.key;

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
     * updates content object to work as a microsoft document
     * @param {Object} content
     * @return {Object}
     */
    function microsoft_media(content) {
        if (!content.type && is_microsoft_extension(content.url)) {
            content.media = {
                type: store.TYPE_RICH,
                html: utils.html('iframe', {
                    src: 'https://view.officeapps.live.com/op/view.aspx?src=' +
                        content.url
                })
            };
        }

        return content;
    }

    function is_microsoft_extension(name) {
        var ext_index = _.lastIndexOf(name, '.'),
            ext = name.substr(ext_index + 1);

        return microsoft_extensions.indexOf(ext) !== -1;
    }

    /**
     * content content cleanup and nomalization
     * @param {Object} content
     * @return {Object}
     */
    function normalize(content) {
        node.innerHTML = content.content || content.description;

        content.orig_content = content.content;
        content.orig_images = content.images;
        content.orig_keywords = content.keywords;

        content.content = _.trim(node.innerText);
        content.contentParts = content.content.split('\n');
        content.keywords = _.pluck(content.keywords, 'name');

        content.images = _(content.images).filter(function (content) {
            return content.width > 500;
        }).pluck('url').uniq().value();

        return content;
    }

    store.fetch = fetch;

    store.TYPE_VIDEO = 'video';
    store.TYPE_ARTICLE = 'article';
    store.TYPE_PHOTO = 'photo';
    store.TYPE_RICH = 'rich';
    store.TYPE_ERROR = 'error';
})(typeof window !== 'undefined' ? window.extract = {} : module.exports);
