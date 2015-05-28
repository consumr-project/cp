'use strict';

var http = require('http');

var base_url = 'http://boilerpipe-web.appspot.com/extract?' +
    'extractor=ArticleExtractor&' +
    'output=json&' + 
    'extractImages=3&' +
    'url=';

/**
 * @param {String} url
 * @param {Function} callback
 */
module.exports = function (url, callback) {
    http.get(base_url + encodeURIComponent(url), function (res) {
        var chunks = [];

        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            chunks.push(chunk);
        });

        res.on('end', function (chunk) {
            callback(JSON.parse(chunks.join("")));
        });
    }).end();
};
