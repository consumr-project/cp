angular.module('tcp').directive('photo', function () {
    'use strict';

    return {
        replace: true,
        templateUrl: '/app/modules/article/photo.html',
        scope: {
            entry: '=',
            onFoundUseful: '&'
        }
    };
});
