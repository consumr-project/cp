'use strict';

var CHAR_NL = '\n',
    CHAR_REF = '^';

var getset = require('deep-get-set'),
    striptags = require('striptags');

var request = require('request'),
    filter = require('lodash/filter'),
    map = require('lodash/map');

/**
 * interface WikiExtract {
 *     id: number;
 *     title: string;
 *     extract: string;
 * }
 *
 * @param {Object} obj
 * @return {WikiExtract}
 */
function normalize_extract(obj) {
    return {
        id: obj.pageid,
        title: obj.title || '',
        extract: filter((obj.extract || '').split(CHAR_NL), function (line) {
            return line[0] !== CHAR_REF;
        }).join(CHAR_NL).trim()
    };
}

/**
 * interface WikiSearchResult {
 *     title: string;
 *     snippet: string;
 * }
 *
 * @param {Object} obj
 * @return {WikiSearchResult}
 */
function normalize_search_result(obj) {
    return {
        title: obj.title,
        snippet: striptags(obj.snippet || '')
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
 * @param {http.Request} req
 * @param {http.Response} res
 * @param {Function} next
 * @param {RequestPayload} params
 * @param {Function<ResponsePayload>} parser
 * @return {void}
 */
function wikipedia(req, res, next, params, parser) {
    var start_time = Date.now();

    params.action = 'query';
    params.format = 'json';

    request({
        uri: 'https://en.wikipedia.org/w/api.php',
        qs: params
    }, function (err, xres, body) {
        var res_body = {};

        if (err) {
            next(err);
            return;
        }

        try {
            res_body.body = parser(JSON.parse(body));
            res_body.meta = {
                elapsed_time: Date.now() - start_time,
                href: xres.request.url.href
            };

            res.json(res_body);
        } catch (err) {
            next(err);
        }
    });
}

/**
 * @param {http.Request} req
 * @param {http.Response} res
 * @param {Function} next
 */
module.exports.extract = function (req, res, next) {
    wikipedia(req, res, next, {
        prop: 'extracts',
        exintro: '',
        explaintext: '',
        titles: req.query.q,
    }, function (body) {
        return map(getset(body, 'query.pages'), normalize_extract).pop();
    });
};

/**
 * @param {http.Request} req
 * @param {http.Response} res
 * @param {Function} next
 */
module.exports.search = function (req, res, next) {
    wikipedia(req, res, next, {
        list: 'search',
        srprop: 'snippet',
        srlimit: '50',
        srsearch: req.query.q,
    }, function (body) {
        return map(getset(body, 'query.search'), normalize_search_result);
    });
};
