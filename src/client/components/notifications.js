angular.module('tcp').directive('notifications', [
    'Services',
    'Session',
    'utils',
    function (Services, Session, utils) {
        'use strict';

        /**
         * @param {Angular.Scope} $scope
         * @param {String} user_id
         * @return {Promise<Notification[]>}
         */
        function load($scope, user_id) {
            return Services.notification.get()
                .then(utils.scope.set($scope, 'notifications'));
        }

        /**
         * @param {Angular.Scope} $scope
         * @return {void}
         */
        function controller($scope) {
            $scope.notifications = [];

            if (Session.USER.id) {
                load($scope, Session.USER.id);
            }
        }

        return {
            replace: true,
            controller: ['$scope', controller],
            scope: {
                notifications: '=?',
            },
            template: [
                '<div class="notifications">',
                '    <div ng-repeat="notification in notifications">',
                '        {{ notifications | json }}',
                '    </div>',
                '</div>'
            ].join('')
        };
    }
]);
