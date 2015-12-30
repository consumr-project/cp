'use strict';

var config = require('acm'),
    request = require('request');

var CRUNCHBASE_API_KEY = config('crunchbase.api.key');

/**
 * @param {http.Request} req
 * @param {http.Response} res
 * @param {Function} next
 */
function companies(req, res, next) {
    request({
        uri: 'https://api.crunchbase.com/v/3/organizations',
        qs: {
            query: req.query.q,
            page: req.query.page || 1,
            user_key: CRUNCHBASE_API_KEY
        }
    }, function (err, xres, body) {
        if (err) {
            next(err);
            return;
        }

        try {
            body = JSON.parse(body);
            res.json({
                body: body.data.items,
                meta: body.data.paging
            });
        } catch (ignore) {
            err = new Error('could not parse response');
            next(err);
            return;
        }
    });
}

module.exports.companies = companies;
