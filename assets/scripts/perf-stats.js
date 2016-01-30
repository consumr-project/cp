$(function () {
    'use strict';

    /* global $, showAngularStats */

    showAngularStats({
        position: 'bottomright',
        digestTimeThreshold: 16,
        autoload: true,
        logDigest: true,
        logWatches: true
    });
});
