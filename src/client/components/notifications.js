angular.module('tcp').directive('notifications', [
    'DOMAIN',
    'Services',
    'Session',
    'utils',
    'utils2',
    'messages',
    'i18n',
    'lodash',
    function (DOMAIN, Services, Session, utils, utils2, messages, i18n, lodash) {
        'use strict';

        var VIEW_CHECK_DELAY = 50;

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
                        objs: notifications,
                        seen: !lodash.filter(notifications, { viewed: false }).length,
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

        /**
         * @param {jQuery} $elem
         * @return {String[]}
         */
        function get_elem_notification_ids($elem) {
            return lodash.map(angular.element($elem).scope().notification.objs, 'id');
        }

        /**
         * @param {jQuery} $elem
         */
        function check_if_viewed($elem) {
            var ids = [];

            $elem.find('.notification').each(function () {
                if (utils.elem_is_visible(this)) {
                    ids = ids.concat(get_elem_notification_ids(this));
                    angular.element(this).addClass('notification--viewed');
                }
            });

            Services.notification.viewed(lodash.uniq(ids))
                .then(function () {
                    // maybe should just pass new count
                    Session.emit(Session.EVENT.NOTIFY);
                });
        }

        /**
         * @param {Angular.Scope} $scope
         * @param {jQuery} $elem
         * @param {Angular.Attributes} $attrs
         */
        function link($scope, $elem, $attrs) {
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
                '</div>'
            ].join('')
        };
    }
]);
