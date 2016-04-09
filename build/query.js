"use strict";
var lodash_1 = require('lodash');
var PARAMS = /:\w+/g;
function track_metrics(action, one_row) {
    if (one_row === void 0) { one_row = false; }
    var start = Date.now();
    var meta = { ok: true };
    return action.then(function (res) {
        var body = one_row ? lodash_1.head(lodash_1.head(res)) : lodash_1.head(res);
        return { meta: meta, body: body };
    });
}
function track_error(next, action) {
    return action.catch(function (err) {
        return handle_error(next, err);
    });
}
function handle_error(next, err) {
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
function query(conn, sql, one_row) {
    if (one_row === void 0) { one_row = false; }
    return function (req, res, next) {
        var replacements = lodash_1.merge(req.query, req.params), merged_sql = sql(req), params = get_params(merged_sql), query;
        try {
            check_params(params, replacements);
            query = conn.query(merged_sql, { replacements: replacements });
            track_metrics(track_error(next, query), one_row)
                .then(function (response) { return res.json(response); });
        }
        catch (err) {
            handle_error(next, err);
        }
    };
}
exports.__esModule = true;
exports["default"] = query;
