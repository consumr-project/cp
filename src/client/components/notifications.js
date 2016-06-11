angular.module('tcp').directive('notifications', [
    'DOMAIN',
    'Services',
    'Session',
    'utils2',
    'messages',
    'i18n',
    'lodash',
    function (DOMAIN, Services, Session, utils2, messages, i18n, lodash) {
        'use strict';

        var FILTER_FOLLOWED = {
            category: DOMAIN.model.message.category.notification,
            subcategory: DOMAIN.model.message.subcategory.followed,
        };

        function group($scope, notifications) {
            var followed;

            notifications = notifications;
            notifications = utils2.group_by_day(notifications);

            notifications.forEach(function (notifications) {
                lodash(notifications).groupBy('subcategory').each(function (notifications) {
                    $scope.notifications.push({
                        type: notifications[0].subcategory,
                        date: notifications[0].date,
                        user: notifications[0].payload.id,
                        html: messages.stringify(i18n, notifications),
                    });
                }).value();
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
