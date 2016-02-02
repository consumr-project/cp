"use strict";
var config = require('acm');
var request = require('request');
var EMBED_URL = 'http://api.embed.ly/1/extract';
var EMBED_KEY = config('embedly.api.key');
function query(req) {
    return {
        key: EMBED_KEY,
        maxwidth: 1000,
        maxheight: 1000,
        url: req.query.url
    };
}
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
function extract(req, res, next) {
    request({
        uri: EMBED_URL,
        qs: query(req)
    }, function (err, xres, body) {
        if (err) {
            next(err);
            return;
        }
        try {
            res.json(parse(JSON.parse(body)));
        }
        catch (ignore) {
            err = new Error('could not parse response');
            next(err);
        }
    });
}
exports.extract = extract;
