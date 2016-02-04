"use strict";
var lodash_1 = require('lodash');
var PARAMS = /:\w+/g;
function get_meta(start, results) {
    return {
        timed_out: false,
        took: Date.now() - start,
        total: results.length
    };
}
function track_metrics(action) {
    var start = Date.now();
    return action.then(function (res) {
        return {
            meta: get_meta(start, res[0]),
            body: res[0]
        };
    });
}
function track_error(next, action) {
    return action.catch(function (err) {
        return handle_error(next, err);
    });
}
function handle_error(next, err) {
    console.error('ERROR');
    console.error(err);
    next(err);
}
function get_params(sql) {
    return lodash_1.map(lodash_1.uniq(sql.match(PARAMS) || []), function (field) {
        return field.substr(1);
    });
}
function check_params(params, replacements) {
    if (lodash_1.difference(params, Object.keys(replacements)).length) {
        throw new Error("Required params: " + params.join(', '));
    }
}
function query(conn, sql) {
    var params = get_params(sql);
    return function (req, res, next) {
        var replacements = req.query, query;
        try {
            check_params(params, replacements);
            query = conn.query(sql, { replacements: replacements });
            track_metrics(track_error(next, query))
                .then(function (response) { return res.json(response); });
        }
        catch (err) {
            handle_error(next, err);
        }
    };
}
exports.query = query;
