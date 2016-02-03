"use strict";
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
function handle_error(next, action) {
    return action.catch(function (err) {
        console.error(err);
        next(err);
    });
}
function query(conn, sql) {
    return function (req, res, next) {
        return track_metrics(handle_error(next, conn.query(sql, {
            replacements: req.query
        }))).then(function (response) { return res.json(response); });
    };
}
exports.query = query;
