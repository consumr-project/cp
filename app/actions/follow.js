'use strict';

var https = require('https'),
    http = require('http'),
    url = require('url');

var protocols = {
    'https:': https,
    'http:': http
};

/**
 * takes a `url` which is followed until there are no redirects. used to
 * convert shortened urls into their final destination:
 * https://goo.gl/hBHlyi -> https://github.com/search?utf8=%E2%9C%93&q=testing
 * @param {String} originalUrl
 * @param {Function} callback
 */
module.exports = function (originalUrl, callback) {
    var startTime = Date.now();

    (function follow(urlToCheck) {
        var check = url.parse(urlToCheck);

        if (!(check.protocol in protocols)) {
            throw new Error('Invalid protocol: ' + check.protocol);
        }

        protocols[check.protocol].request({
            method: 'HEAD',
            host: check.host,
            port: check.port,
            path: check.path
        }, function (reqRes) {
            if (reqRes.headers.location) {
                follow(reqRes.headers.location);
            } else {
                callback({
                    checkTime: Date.now() - startTime,
                    startUrl: url.parse(originalUrl),
                    endUrl: check,
                });
            }
        }).end();
    })(originalUrl);
};
