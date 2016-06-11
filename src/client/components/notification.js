angular.module('tcp').directive('notification', [
    function () {
        'use strict';

        return {
            replace: true,
            scope: {
                model: '=',
            },
            template: [
                '<div class="notification">',
                '    <table>',
                '        <tr>',
                '            <td>',
                '                <avatar user-id="{{::model.user}}"></avatar>',
                '            </td>',
                '            <td>',
                '                <p ng-bind-html="::model.html"></p>',
                '                <i18n date="{{::model.date}}" format="MMM D"></i18n>',
                '            </td>',
                '        </tr>',
                '    </table>',
                '</div>'
            ].join('')
        };
    }
]);
