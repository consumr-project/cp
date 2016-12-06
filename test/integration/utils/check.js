'use strict';

/**
 * @param {Tape} t
 * @param {Error} [err]
 * @param {Response} res
 * @return {void}
 */
function rescheck(t, err, res) {
    t.error(err, 'no error');
    t.equal(200, res.status, 'returned a 200 status code');
    t.ok(res.body.body, 'has a service response body');
    t.ok(res.body.meta, 'has service response metadata');
}

module.exports = { rescheck };
