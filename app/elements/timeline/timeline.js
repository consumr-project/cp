angular.module('tcp').directive('timeline', [
    'd3',
    function (d3) {
        'use strict';

        return {
            replace: true,
            transclude: true,
            template: '<div></div>',

            link: function () {
                console.log(d3);
            }
        };
    }
]);
