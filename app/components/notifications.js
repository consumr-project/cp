angular.module('tcp').directive('notifications', [
    'ServicesService',
    'SessionService',
    'utils',
    'lodash',
    function (ServicesService, SessionService, utils, lodash) {
        'use strict';

        /**
         * @param {Message} notification
         * @return {UIMessage}
         */
        function normalize_notification(notification) {
            return {
                id: notification.id,
                subject: notification.subject,
                payload: notification.payload || {}
            };
        }

        /**
         * @param {Message[]} notifications
         */
        function normalize_notifications(notifications) {
            return lodash.reduce(notifications, function (group, notification) {
                var type;

                var subject = notification.subject,
                    normalized = normalize_notification(notification);

                switch (notification.subject) {
                    case ServicesService.notification.TYPE.MISSING_INFORMATION:
                        type = notification.payload.obj_type;
                        group[subject] = lodash.get(group, subject, {});
                        group[subject][type] = lodash.get(group[subject], type, []);
                        group[subject][type].push(normalized);
                        break;

                    default:
                        group[subject] = lodash.get(group, subject, []);
                        group[subject].push(normalized);
                        break;
                }

                return group;
            }, {});
        }

        function controller($scope) {
            $scope.notifications = {};

            /**
             * @param {String} id
             * @return {Promise}
             */
            function load(id) {
                return ServicesService.notification.get(
                    ServicesService.notification.TYPE.MISSING_INFORMATION)
                        .then(normalize_notifications)
                        .then(utils.scope.set($scope, 'notifications'));
            }

            if (SessionService.USER.id) {
                load(SessionService.USER.id);
            }
        }

        return {
            replace: true,
            controller: ['$scope', controller],
            template: [
                '<div>',
                '    <h2 i18n="notification/notifications"></h2>',
                '    <hr />',
                '    <div class="desktop-only padding-top-large"></div>',

                '    <div ng-if="::notifications.MISSING_INFORMATION.company">',
                '        <h3 i18n="notification/new_company_details"></h3>',
                '        <div class="notification--missing-information" ',
                '            ng-repeat="notification in notifications.MISSING_INFORMATION.company">',
                '            <span i18n="notification/new_company_message" prop="html" data="{',
                '                obj_id: notification.payload.obj_id,',
                '                obj_name: notification.payload.obj_name,',
                '                obj_type: notification.payload.obj_type,',
                '                obj_for_id: notification.payload.obj_for_id,',
                '                obj_for_name: notification.payload.obj_for_name,',
                '                obj_for_type: notification.payload.obj_for_type',
                '            }"></span>',
                '            <ul>',
                '                <li ng-repeat="field in notification.payload.obj_fields">{{field}}</li>',
                '            </ul>',
                '        </div>',
                '    </div>',
                '</div>'
            ].join('')
        };
    }
]);
