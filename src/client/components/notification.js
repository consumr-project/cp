angular.module('tcp').directive('notification', [
    'Navigation',
    'Services',
    'lodash',
    function (Navigation, Services, lodash) {
        'use strict';

        /**
         * @param {Message[]} messages
         * @return {Promise}
         */
        function mark_as_completed(messages) {
            return Services.notification.completed(lodash.map(messages, 'id'));
        }

        return {
            replace: true,
            scope: {
                model: '=',
            },
            controller: ['$scope', function ($scope) {
                $scope.click = function ($ev) {
                    if ($scope.model.href) {
                        Navigation.go_to($scope.model.href);
                        mark_as_completed($scope.model.messages);
                        $scope.model.is_completed = true;
                    }
                };
            }],
            template: [
                '<div class="notification" ng-click="click()" ng-class="{',
                '    \'notification--completed\': model.is_completed,',
                '}">',
                '    <table>',
                '        <tr>',
                '            <td>',
                '                <avatar user-id="{{::model.user_id}}"></avatar>',
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
