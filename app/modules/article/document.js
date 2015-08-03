angular.module('tcp').directive('document', function () {
    'use strict';

    return {
        replace: true,
        templateUrl: '/app/modules/article/document.html',
        scope: {
            entry: '=',
            onFoundUseful: '&'
        }
    };
});
