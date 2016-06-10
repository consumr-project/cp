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
                '                <avatar></avatar>',
                '            </td>',
                '            <td>',
                '                <p>{{::model.text}}</p>',
                '                <i18n date="{{::model.date}}" format="MMM D"></i18n>',
                '            </td>',
                '        </tr>',
                '    </table>',
                '</div>'
            ].join('')
        };
    }
]);
