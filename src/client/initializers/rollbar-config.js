/* global Rollbar, TCP_BUILD_CONFIG */
(function (config) {
    'use strict';

    if (window.DEBUGGING) {
        return;
    }

    if (!config || !config.rollbar) {
        throw new Error('Missing Rollbar configuration');
    }

    Rollbar.init({
        captureUncaught: true,
        accessToken: config.rollbar.token,
        payload: {
            environment: config.environment.name
        }
    });
})(TCP_BUILD_CONFIG);
