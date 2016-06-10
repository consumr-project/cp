angular.module('tcp').directive('notifications', [
    'Services',
    'Session',
    'utils2',
    'messages',
    'i18n',
    'lodash',
    function (Services, Session, utils2, messages, i18n, lodash) {
        'use strict';

        var FILTER_FOLLOWED = {
            category: 'NOTIFICATION',
            subcategory: 'FOLLOWED',
        };

        function group($scope, notifications) {
            var followed;

            notifications = notifications;
            followed = lodash.filter(notifications, FILTER_FOLLOWED);
            followed = utils2.group_by_day(followed);

            followed.forEach(function (followed) {
                $scope.notifications.push({
                    type: 'FOLLOWED',
                    date: followed[0].date,
                    user: followed[0].payload.id,
                    text: messages.stringify(i18n, followed),
                });
            });
        }

        /**
         * @param {Angular.Scope} $scope
         * @param {String} user_id
         * @return {Promise<Message[]>}
         */
        function load($scope, user_id) {
            return Services.notification.get()
                .then(group.bind(null, $scope));
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
                '    <notification ng-repeat="notification in notifications"',
                '        model="notification"></notification>',
                '</div>'
            ].join('')
        };
    }
]);
