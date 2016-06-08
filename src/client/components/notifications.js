angular.module('tcp').directive('notifications', [
    'DOMAIN',
    'Services',
    'Session',
    'utils',
    'lodash',
    function (DOMAIN, Services, Session, utils, lodash) {
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
                    case Services.notification.TYPE.MISSING_INFORMATION:
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
            }, { count: notifications.length });
        }

        function controller($scope) {
            $scope.escape = lodash.escape;
            $scope.notifications = {};

            $scope.vm = {
                loading: false,
                notification_popup: {},
            };

            /**
             * @param {Message} notification
             * @return {Promise}
             */
            $scope.ignore = function (notification) {
                notification.$loading = true;

                return Services.notification.delete(notification.id).then(function (action) {
                    Session.emit(Session.EVENT.NOTIFY);
                    notification.$loading = false;
                    notification.$deleted = action && action.ok;
                }).catch(function () {
                    notification.$loading = false;
                    notification.$deleted = false;
                });
            };

            /**
             * @param {Message} notification
             * @return {Promise}
             */
            $scope.update = function (notification) {
                $scope.vm.notification_popup.hide();
                notification.$loading = true;

                return Services.query.companies.update(
                    notification.payload.obj_id,
                    $scope.vm.selected_notification.$update
                ).then($scope.ignore.bind(null, notification));
            };

            /**
             * @param {Message} notifications
             * @return {void}
             */
            $scope.select = function (notification) {
                $scope.vm.loading_obj = true;
                $scope.vm.selected_notification = notification;
                $scope.vm.selected_notification.$update = {};
                $scope.vm.notification_popup.show();

                switch (notification.payload.obj_type) {
                    case DOMAIN.model.company:
                        Services.query.companies.retrieve(notification.payload.obj_id).then(function (company) {
                            $scope.vm.loading_obj = false;
                            lodash.map(notification.payload.obj_fields, function (field) {
                                $scope.vm.selected_notification.$update[field] = company[field];
                            });
                        });
                        break;

                    default:
                        console.err('invalid notification payload %o', notification);
                        break;
                }
            };

            if (Session.USER.id) {
                $scope.vm.loading = true;
                Services.notification.get(
                    Services.notification.TYPE.MISSING_INFORMATION)
                        .then(normalize_notifications)
                        .then(utils.scope.set($scope, 'notifications'))
                        .then(utils.scope.set($scope, 'vm.loading', false));
            }
        }

        return {
            replace: true,
            controller: ['$scope', controller],
            template: [
                '<div class="notifications">',
                '    <div ng-repeat="notification in ::notifications.MISSING_INFORMATION.company">',
                '    {{ notification | json }}',
                '    </div>',
                '</div>'
            ].join('')
        };
    }
]);
