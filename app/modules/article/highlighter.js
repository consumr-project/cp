angular.module('tcp').directive('highlighter', [
    '$document',
    'highlighter',
    function ($document, highlighter) {
        'use strict';

        $document.on('mouseup', function () {
        });

        return {
            link: function (scope, elem, attr) {
            }
        };
    }
]);
