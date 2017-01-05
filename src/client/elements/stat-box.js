/**
 * @attribute {string} label
 * @attribute {string} value
 */
angular.module('tcp').directive('statBox', [
    function () {
        'use strict';

        return {
            replace: true,

            scope: {
                label: '@',
                value: '@',
            },

            template: [
                '<div class="stat-box">',
                    '<div class="stat-box__value">{{value}}</div>',
                    '<div class="stat-box__label">{{label}}</div>',
                '</div>',
            ].join(''),
        };
    }
]);
