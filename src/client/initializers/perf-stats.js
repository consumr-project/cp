/* global $, showAngularStats */
$(function () {
    'use strict';

    if (!window.showAngularStats) {
        return;
    }

    showAngularStats({
        position: 'bottomright',
        digestTimeThreshold: 16,
        autoload: true,
        logDigest: true,
        logWatches: true
    });
});
