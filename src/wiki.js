'use strict';

var request = require('request'),
    filter = require('lodash/collection/filter'),
    map = require('lodash/collection/map');

/**
 * @param {WikiExtracts} page
 * @return {WikiExtracts}
 */
function clean_extract(page) {
    page.extract = filter(page.extract.split('\n'), function (line) {
        return line[0] !== '^';
    });
    return page;
}

/**
 * interface WikiExtract {
 *     id: number;
 *     title: string;
 *     extract: string;
 * }
 *
 * interface WikiExtracts {
 *     id: number;
 *     title: string;
 *     extract: string;
 *     rest: WikiExtract[]
 * }
 *
 * @param {ResponsePayload} body
 * @return {WikiExtracts}
 */
function parse(body, meta) {
    var rest = map(map((body.query || {}).pages, extract), clean_extract),
        extracts = rest.pop();

    extracts.meta = meta;
    extracts.rest = rest;
    return extracts;
}

/**
 * @param {Object} obj
 * @return {WikiExtract}
 */
function extract(obj) {
    return {
        id: obj.pageid,
        title: obj.title || '',
        extract: obj.extract || ''
    };
}

/**
 * interface RequestPayload {
 *     action: string;
 *     exintro: string;
 *     explaintext: string;
 *     format: string;
 *     prop: string;
 *     titles: string;
 * }
 *
 * interface ResponsePayload {
 *     batchcomplete: string;
 *     query: {
 *         pages: {
 *             [id]: {
 *                 extract: string;
 *                 ns: number;
 *                 pageid: number;
 *                 title: string;
 *             };
 *         };
 *     };
 * }
 *
 * @param {RequestPayload} params
 * @param {Function<ResponsePayload>} params
 * @return {void}
 */
function wikipedia(params, callback) {
    var start_time = Date.now();

    params.format = 'json';
    request({
        uri: 'https://en.wikipedia.org/w/api.php',
        qs: params
    }, function (err, xres, body) {
        if (err) {
            callback(err);
            return;
        }

        try {
            callback(null, parse(JSON.parse(body), {
                elapsed_time: Date.now() - start_time,
                href: xres.request.url.href
            }));
        } catch (err) {
            callback(err);
        }
    });
}

/**
 * @param {http.Request} req
 * @param {http.Response} res
 * @param {Function} next
 */
module.exports.query_extracts = function (req, res, next) {
    wikipedia({
        action: 'query',
        prop: 'extracts',
        exintro: '',
        explaintext: '',
        titles: req.query.q,
    }, function (err, body) {
        if (err) {
            next(err);
        } else {
            res.json(body);
        }
    });
};
