angular.module('tcp').directive('notifications', [
    'DOMAIN',
    'Services',
    'SessionService',
    'utils',
    'lodash',
    function (DOMAIN, Services, SessionService, utils, lodash) {
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
                    SessionService.emit(SessionService.EVENT.NOTIFY);
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

            if (SessionService.USER.id) {
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
                '<div>',
                '    <h1 i18n="notification/notifications"></h1>',
                '    <hr />',

                '    <h3 ng-show="!vm.loading && !notifications.count" ',
                '        class="margin-top-xlarge center-align" ',
                '        i18n="notification/no_notifications"></h3>',

                '    <div class="animated fadeIn" ng-if="notifications.MISSING_INFORMATION.company">',
                '        <div class="notification notification--missing-information can-load" ',
                '            ng-class="{loading: notification.$loading || notification.$deleted}" ',
                '            ng-repeat="notification in ::notifications.MISSING_INFORMATION.company">',
                '            <div class="notification__content">',
                '                <span i18n="notification/new_company_message" prop="html" data="{',
                '                    obj_id: escape(notification.payload.obj_id),',
                '                    obj_name: escape(notification.payload.obj_name),',
                '                    obj_type: escape(notification.payload.obj_type),',
                '                    obj_for_id: escape(notification.payload.obj_for_id),',
                '                    obj_for_name: escape(notification.payload.obj_for_name),',
                '                    obj_for_type: escape(notification.payload.obj_for_type)',
                '                }"></span>',

                '                <span ng-repeat="field in ::notification.payload.obj_fields">',
                '                    <span class="no-white-space">',
                '                        <span ng-show=":: $last && !$first" i18n="common/enumeration_comma_last"></span>',
                '                        <span ng-show=":: !$last && !$first" i18n="common/enumeration_comma"></span>',
                '                        <b>{{::field}}</b>',
                '                    </span>',
                '                </span>',

                '                <div class="margin-top-small">',
                '                    <button ng-click="select(notification)" ',
                '                        ng-disabled="notification.$deleted"',
                '                        i18n="common/go"></button>',
                '                    <button ng-click="ignore(notification)" ',
                '                        ng-disabled="notification.$deleted"',
                '                        i18n="common/ignore" class="button--secondary"></button>',
                '                </div>',
                '            </div>',
                '        </div>',
                '    </div>',

                '    <popover with-close-x with-backdrop api="vm.notification_popup" class="popover--with-content">',
                '        <form class="form--listed">',
                '            <h2 i18n="event/add"></h2>',

                '            <section popover-body ng-class="{ loading: vm.loading_obj }">',
                '                <div ng-switch="field" ng-repeat="field in vm.selected_notification.payload.obj_fields">',
                '                    <label ng-switch="field" for="notification_update_{{$index}}">{{field}}</label>',
                '                    <textarea ng-switch-when="summary" id="notification_update_{{$index}}" ng-model="vm.selected_notification.$update[field]"></textarea>',
                '                    <input ng-switch-default id="notification_update_{{$index}}" ng-model="vm.selected_notification.$update[field]" />',
                '                </div>',
                '            </section>',

                '            <button class="right margin-top-small" ng-click="update(vm.selected_notification)"',
                '                i18n="admin/save"></button>',
                '            <button class="right margin-top-small button--link" ng-click="vm.notification_popup.hide()"',
                '                i18n="admin/cancel"></button>',
                '        </form>',
                '    </popover>',
                '</div>'
            ].join('')
        };
    }
]);
