'use strict';

var request = require('request'),
    map = require('lodash/collection/map');

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
function parse(body) {
    var rest = map((body.query || {}).pages, extract),
        extracts = extract(rest[0] || {});

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
            callback(null, parse(JSON.parse(body)));
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
