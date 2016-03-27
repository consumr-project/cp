angular.module('tcp').directive('tcpTopmost', [
    '$interval',
    'Navigation',
    'Services',
    'SessionService',
    'utils',
    'Cookie',
    'lodash',
    function ($interval, Navigation, Services, SessionService, utils, Cookie, _) {
        'use strict';

        var SYNC_INTERVAL = 300000;

        function controller($rootScope, $scope) {
            $scope.session = get_session();

            $scope.actions = {
                show: null
            };

            $scope.login = {
                more: false,

                // from popover
                hide: null,
                show: null
            };

            $scope.nav = {
                home: Navigation.home,
                search: Navigation.search,
                company: Navigation.company,
                notifications: Navigation.notifications,
                profile: Navigation.user_me,
            };

            $scope.with_linkedin = login_with_linkedin;
            $scope.login = login;
            $scope.logout = logout;

            $scope.$watchCollection('session', cache_session);
            SessionService.on(SessionService.EVENT.LOGIN, update_current_user);
            SessionService.on(SessionService.EVENT.LOGIN, get_messages);
            SessionService.on(SessionService.EVENT.ERROR, clear_session);
            SessionService.on(SessionService.EVENT.LOGOUT, clear_session);
            SessionService.on(SessionService.EVENT.NOTIFY, get_messages);

            sync();
            $interval(sync, SYNC_INTERVAL);
            $rootScope.$on('$locationChangeStart', update_page_view_status);

            function login_with_linkedin() {
                console.info('loggin in with linkedin');
                $scope.login.hide();
                SessionService.login(SessionService.PROVIDER.LINKEDIN);
            }

            function login() {
                $scope.login.show();
            }

            function logout() {
                console.info('logging out');
                SessionService.logout();
                $scope.actions.show = false;
            }

            /**
             * caches user information
             */
            function update_current_user() {
                $scope.session.email = SessionService.USER.email;
                $scope.session.logged_in = true;
            }

            /**
             * @return {Promise}
             */
            function get_messages() {
                Services.notification.get.cancel();
                return Services.notification.get().then(function (items) {
                    $scope.session.message_count = items.length;
                });
            }

            /**
             * @return {void}
             */
            function sync() {
                SessionService.refresh().then(function (user) {
                    if (user && user.id) {
                        get_messages();
                    }
                });
            }

            /**
             * resets session
             */
            function clear_session() {
                $scope.session = {};
            }

            /**
             * @param {Object} session (see $scope.session)
             */
            function cache_session(session) {
                console.info('caching %o in session', Object.keys(session));
                return Cookie.set('client:session', session);
            }

            /**
             * @return {Object}
             */
            function get_session() {
                return Cookie.getJSON('client:session') || {};
            }

            function update_page_view_status() {
                $scope.nav.search.active = Navigation.oneOf([
                    Navigation.BASES.SEARCH
                ]);

                $scope.nav.search.included = Navigation.oneOf([
                    Navigation.BASES.HOME,
                    Navigation.BASES.SEARCH
                ]);
            }
        }

        return {
            replace: true,
            controller: ['$rootScope', '$scope', controller],
            template: [
                '<div>',
                '    <popover class="popover--fullscreen" api="login" ng-init="more = false">',
                '        <div class="site-content site-content--no-header">',
                '            <h2 i18n="common/welcome"></h2>',
                '            <p i18n="common/intro"></p>',
  
                '            <div class="margin-bottom-medium">',
                '                <button class="margin-top-small button--social-linkedin" ng-click="with_linkedin()">',
                '                    <img alt="" src="assets/images/linkedin.png" />',
                '                    <span i18n="admin/sing_in_with_service" data="{service: \'LinkedIn\'}"></span>',
                '                </button>',
 
                '                <button ng-click="more = true" i18n="admin/more_options"></button>',
                '            </div>',

                '            <button class="button--link" ng-click="login.hide()" i18n="admin/remind_later"></button>',

                '            <div ng-show="more" class="animated fadeInUp">',
                '                <p i18n="admin/sign_in_with_email"></p>',
                '                <input class="large" type="text" placeholder="you@email.com" />',
                '            </div>',
                '        </div>',
                '    </popover>',

                '    <header class="site-content--span">',
                '        <img class="tcp-logo" alt="" ng-click="nav.home()"',
                '            src="assets/images/brand/consumrproject-black-stamp.png" />',

                '        <button ng-if="!session.logged_in" ng-click="login()"',
                '            i18n="admin/sing_in_or_up" class="right animated fadeIn"></button>',

                '        <avatar',
                '            ng-if="session.logged_in"',
                '            class="right no-outline"',
                '            ng-click="actions.show = true"',
                '            email="{{session.email}}"',
                '            data-main-user-avatar',
                '        >',
                '            <indicator',
                '                class="animated zoomIn"',
                '                ng-if="session.message_count"',
                '                type="counter"',
                '                value="session.message_count"',
                '            ></indicator>',
                '        </avatar>',

                '        <button class="search-button right margin-right-small animated fadeIn screen-small-only"',
                '            ng-click="nav.search()"></button>',

                '        <search class="desktop-only right margin-right-small"',
                '            form="true" ng-if="!nav.search.included"></search>',
                '    </header>',

                '    <popover',
                '        anchored',
                '        anchored-element="\'[data-main-user-avatar]\'"',
                '        anchored-show="actions.show"',
                '        anchored-placement="bottom-right"',
                '        anchored-top-offset="10"',
                '        anchored-arrow="true"',
                '        anchored-auto-hide="true"',
                '    >',
                '        <popover-item ng-click="nav.company(); actions.show = false;" i18n="admin/add_company"></popover-item>',
                '        <popover-separator></popover-separator>',
                '        <popover-item ng-click="nav.profile(); actions.show = false;" i18n="pages/profile"></popover-item>',
                '        <popover-item ng-click="nav.notifications(); actions.show = false;" i18n="admin/see_notifications"></popover-item>',
                '        <popover-item ng-click="logout()" i18n="admin/logout"></popover-item>',
                '    </popover>',
                '</div>'
            ].join('')
        };
    }
]);
