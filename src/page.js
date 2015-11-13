'use strict';

var request = require('request'),
    config = require('acm');

var EMBED_URL = 'http://api.embed.ly/1/extract',
    EMBED_KEY = config('embedly.api.key');

/**
 * generates and embed query string
 * @param {http.Request} req
 * @return {EmbedRequest}
 */
function query(req) {
    return {
        key: EMBED_KEY,
        maxwidth: 1000,
        maxheight: 1000,
        url: req.query.url
    };
}

/**
 * takes a raw embed response and cleans it up
 * @param {EmbedResponse} body
 * @return {PageExtract}
 */
function parse(body) {
    return {
        description: body.description,
        keywords: body.keywords,
        published: body.published,
        title: body.title,
        type: body.type,
        url: body.url
    };
}

/**
 * @param {http.Request} req
 * @param {http.Response} res
 * @param {Function} next
 */
module.exports = function (req, res, next) {
    request({
        uri: EMBED_URL,
        qs: query(req)
    }, function (err, xres, body) {
        if (!err) {
            try {
                res.json(parse(JSON.parse(body)));
            } catch (ignore) {
                err = new Error('could not parse response');
            }
        }

        if (err) {
            next(err);
        }
    })
};
