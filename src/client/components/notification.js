angular.module('tcp').directive('notification', [
    'Navigation',
    function (Navigation) {
        'use strict';

        return {
            replace: true,
            scope: {
                model: '=',
            },
            controller: ['$scope', function ($scope) {
                $scope.click = function () {
                    if ($scope.model.href) {
                        Navigation.go_to($scope.model.href);
                    }
                };
            }],
            template: [
                '<div class="notification" ng-click="click()" ng-class="{',
                '    \'notification--done\': model.done,',
                '    }">',
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
