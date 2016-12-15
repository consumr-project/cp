angular.module('tcp').directive('notifications', [
    'Services',
    'Session',
    'utils',
    'messages',
    'i18n',
    'lodash',
    function (Services, Session, utils, messages, i18n, lodash) {
        'use strict';

        var VIEW_CHECK_DELAY = 50;

        function group($scope, notifications) {
            $scope.notifications = messages.prep(i18n, notifications);
        }

        /**
         * @param {Angular.Scope} $scope
         * @return {Promise<Message[]>}
         */
        function load($scope) {
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

        /**
         * @param {jQuery} $elem
         * @return {String[]}
         */
        function get_elem_notification_ids($elem) {
            return lodash.map(angular.element($elem).scope().notification.messages, 'id');
        }

        /**
         * @param {jQuery} $elem
         */
        function check_if_viewed($elem) {
            var ids = [];

            $elem.find('.notification').each(function () {
                if (utils.elem_is_visible(this)) {
                    ids = ids.concat(get_elem_notification_ids(this));
                }
            });

            ids = lodash.uniq(ids);
            ids = lodash.difference(ids, check_if_viewed.ids);
            check_if_viewed.ids = check_if_viewed.ids.concat(ids);

            if (ids.length) {
                Services.notification.viewed(ids).then(function () {
                    // maybe should just pass new count
                    Session.emit(Session.EVENT.NOTIFY);
                });
            }
        }

        // used to track notifications that have already been marked as viewed
        check_if_viewed.ids = [];

        /**
         * @param {Angular.Scope} $scope
         * @param {jQuery} $elem
         */
        function link($scope, $elem) {
            var checker;

            checker = check_if_viewed.bind(null, $elem);
            checker = lodash.debounce(checker, VIEW_CHECK_DELAY);

            $elem.on('scroll', checker);
            $scope.api = $scope.api || {};

            $scope.api.repaint = function () {
                check_if_viewed($elem);
            };
        }

        return {
            replace: true,
            controller: ['$scope', controller],
            link: link,
            scope: {
                api: '=?',
                notifications: '=?',
            },
            template: [
                '<div class="notifications">',
                '    <notification ng-repeat="notification in notifications"',
                '        model="notification"></notification>',
                '    <div ng-if="notifications.length === 0"',
                '        class="notifications__none"',
                '        i18n="notification/none"></div>',
                '</div>'
            ].join('')
        };
    }
]);
