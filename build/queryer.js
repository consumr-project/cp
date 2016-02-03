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
function query(conn, sql) {
    return function (req, res, next) {
        var replacements = req.query, query;
        try {
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
