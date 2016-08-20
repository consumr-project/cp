angular.module('tcp').directive('errorView', [
    function () {
        'use strict';

        var IMAGES = [
            'cactus',
            'dead-fish',
            'ice-cream',
            'soda-spill',
        ];

        var STRINGS = i18n.strings && 'error_pages' in i18n.strings ?
            Object.keys(i18n.strings.error_pages) :
            Object.keys(i18n.def_strings.error_pages);

        /**
         * @param {T[]} arr
         * @return {T}
         */
        function rand(arr) {
            return arr[Math.floor(Math.random() * arr.length)];
        }

        return {
            replace: true,
            template: function () {
                var img = rand(IMAGES),
                    str = rand(STRINGS);

                return [
                    '<div class="error-view-component banner">',
                    '    <div class="site-content center-align">',
                    '        <table>',
                    '            <tr>',
                    '                <td>',
                    '                    <img class="error-view-component--', img, '" src="/assets/images/', img, '.svg" />',
                    '                </td>',
                    '                <td>',
                    '                    <p i18n="error_pages/' + str + '"></p>',
                    '                </td>',
                    '            </tr>',
                    '        </table>',
                    '    </div>',
                    '</div>',
                ].join('');
            },
        };
    }
]);
