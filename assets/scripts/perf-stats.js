/* global $, showAngularStats */
$(function () {
    'use strict';

    showAngularStats({
        position: 'bottomright',
        digestTimeThreshold: 16,
        autoload: true,
        logDigest: true,
        logWatches: true
    });
});
