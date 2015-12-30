'use strict';

var config = require('acm'),
    request = require('request'),
    map = require('lodash/collection/map');

var CRUNCHBASE_API_KEY = config('crunchbase.api.key');

/**
 * @param {OrganizationSummary} company
 * @return {Object}
 */
function flatten_company(company) {
    company.properties.uuid = company.uuid;
    company.properties.type = company.type;
    return company.properties;
}

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
                body: map(body.data.items, flatten_company),
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
