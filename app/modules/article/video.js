angular.module('tcp').directive('video', function () {
    'use strict';

    return {
        replace: true,
        templateUrl: '/app/modules/article/video.html',
        scope: {
            info: '='
        }
    };
});
