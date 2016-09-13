angular.module('tcp').directive('tcpTopmost', [
    'DOMAIN',
    '$interval',
    '$timeout',
    'Navigation',
    'Services',
    'Session',
    'utils',
    'Cookie',
    'lodash',
    'validator',
    function (DOMAIN, $interval, $timeout, Navigation, Services, Session, utils, Cookie, _, validator) {
        'use strict';

        var SYNC_INTERVAL = 300000;

        function link() {
            angular.element(document.body).on('mousemove', function () {
                link.active = true;
            });
        }

        function controller($rootScope, $scope) {
            $scope.vm = {
                show_login: true,
                show_admin: false,
                show_got_beta_email: false,
                attn_beta_email: false,
                error_view: null,
                beta_email: '',
                beta_email_sent_to: '',

                ERROR_CAPTCHA_FAIL: 'errcaptchafail',
                ERROR_HIT_LIMIT: 'errhitlimit',
                ERROR_STD: 'errstd',
            };

            $scope.vm.validation = {
                beta_email: validator({
                    email: function () {
                        return !!$scope.vm.beta_email;
                    },

                    recaptcha: function () {
                        return !!get_recaptcha();
                    },
                }),
            };

            $scope.user = null;
            $scope.session = get_session();

            $scope.notifications = {
                show: null,

                // from notifications component
                repaint: _.noop,
            };

            $scope.actions = {
                show: null
            };

            $scope.login = {
                // from popover
                hide: null,
                show: null
            };

            $scope.nav = {
                admin: Navigation.admin,
                home: Navigation.home,
                search: Navigation.search,
                company: Navigation.company,
                profile: Navigation.user_me,
            };

            $scope.show_notifications = function () {
                $scope.notifications.show = true;
                $timeout($scope.notifications.repaint, 100);
            };

            $scope.submit_beta_email = submit_beta_email;
            $scope.with_linkedin = login_with_linkedin;
            $scope.login = login;
            $scope.logout = logout;

            $scope.$watchCollection('session', cache_session);
            Session.on(Session.EVENT.LOGIN, update_current_user);
            Session.on(Session.EVENT.LOGIN, get_notifications);
            Session.on(Session.EVENT.ERROR, clear_session);
            Session.on(Session.EVENT.LOGOUT, clear_session);
            Session.on(Session.EVENT.NOTIFY, get_notifications);
            Session.on(Session.EVENT.LOCKED_DOWN, show_lockdown_message);

            sync();
            $interval(sync_if_active, SYNC_INTERVAL);
            $rootScope.$on('$locationChangeStart', update_page_view_status);

            /**
             * @return {string}
             */
            function get_recaptcha() {
                // that's right
                return angular.element('.topmost #g-recaptcha-response').val();
            }

            function submit_beta_email() {
                var email = $scope.vm.beta_email;
                var recaptcha = get_recaptcha();

                var success = function () {
                    $scope.vm.show_got_beta_email = true;
                    $scope.vm.beta_email = '';
                    $scope.vm.beta_email_sent_to = email;
                };

                if (!$scope.vm.validation.beta_email.validate()) {
                    return;
                }

                $scope.vm.error_view = null;
                $scope.vm.show_got_beta_email = false;
                $scope.vm.beta_email_sent_to = null;

                Services.query.admin.beta_email_invites.create(email, recaptcha)
                    .then(success)
                    .catch(function (resp) {
                        switch (resp.status) {
                            // recaptcha check fail
                            case 400:
                                $scope.vm.error_view = $scope.vm.ERROR_CAPTCHA_FAIL;
                                break;

                            // duplicate, so we got it already
                            case 409:
                                success();
                                break;

                            // hit rate limit
                            case 429:
                                $scope.vm.error_view = $scope.vm.ERROR_HIT_LIMIT;
                                break;

                            // don't know
                            default:
                                $scope.vm.error_view = $scope.vm.ERROR_STD;
                                break;
                        }
                    });
            }

            function show_lockdown_message() {
                $scope.vm.show_login = false;
                $scope.vm.attn_beta_email = true;
                $scope.$apply();

                $timeout(function () {
                    $scope.vm.attn_beta_email = false;
                }, 2000);
            }

            function login_with_linkedin() {
                console.info('loggin in with linkedin');
                Session.login(Session.PROVIDER.LINKEDIN);
                Session.once(Session.EVENT.LOGIN, $scope.login.hide);
            }

            function login() {
                $scope.login.show();
            }

            function logout() {
                console.info('logging out');
                Session.logout();
                $scope.actions.show = false;
            }

            /**
             * caches user information
             */
            function update_current_user() {
                $scope.session.email = Session.USER.email;
                $scope.session.logged_in = true;
                $scope.vm.show_admin = Session.USER.role === DOMAIN.model.user_props.roles.admin;
            }

            /**
             * @return {Promise}
             */
            function get_notifications() {
                return Services.notification.get().then(function (items) {
                    $scope.session.notification_count = _.filter(items, { viewed: false }).length;
                    $scope.session.has_notifications = items.length;
                });
            }

            /**
             * @return {void}
             */
            function sync_if_active() {
                console.log('sync_if_active check');
                if (link.active) {
                console.log('sync_if_active running');
                    sync();
                    link.active = false;
                }
            }

            /**
             * @return {void}
             */
            function sync() {
                Session.refresh().then(function (user) {
                    $scope.user = user;

                    if (user && user.id) {
                        get_notifications();
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
                $scope.nav.search.active = Navigation.one_of([
                    Navigation.BASES.SEARCH,
                ]);

                $scope.nav.search.included = Navigation.one_of([
                    Navigation.BASES.HOME,
                    Navigation.BASES.SEARCH,
                ]);
            }
        }

        return {
            replace: true,
            scope: true,
            link: link,
            controller: ['$rootScope', '$scope', controller],
            template: [
                '<div class="topmost">',
                '    <popover class="popover--fullscreen" api="login">',
                '        <div class="site-content site-content--slim-100 site-content--no-header center-align">',
                '            <div class="close-x close-x--topright" ng-click="login.hide()"></div>',
                '            <h2 i18n="common/welcome_beta" class="italic font-size-xlarge"></h2>',

                '            <section class="animated" ng-class="{bounce: vm.attn_beta_email}">',
                '                <h4 class="bold margin-top-xlarge margin-bottom-small"',
                '                    i18n="admin/first_time"></h4>',
                '                <message closable',
                '                    class="margin-bottom-xsmall"',
                '                    ng-if="!vm.show_got_beta_email && vm.error_view"',
                '                    type="error">',
                '                    <span ng-if="vm.error_view === vm.ERROR_CAPTCHA_FAIL" i18n="admin/captcha_fail"></span>',
                '                    <span ng-if="vm.error_view === vm.ERROR_HIT_LIMIT" i18n="common/error_hit_limit"></span>',
                '                    <span ng-if="vm.error_view === vm.ERROR_STD" i18n="common/error_loading"></span>',
                '                </message>',
                '                <message closable',
                '                    class="margin-bottom-xsmall"',
                '                    ng-if="vm.show_got_beta_email && !vm.error_view"',
                '                    type="success">',
                '                    <span i18n="admin/got_it" data="{email: vm.beta_email_sent_to}"></span>',
                '                </message>',
                '                <input class="input--buttonlike full-span block margin-bottom-xsmall"',
                '                    ng-model="vm.beta_email"',
                '                    i18n="admin/enter_email_for_beta"',
                '                    prop="placeholder" />',
                '                <div i18n="admin/missing_email"',
                '                    ng-class="{invalid: vm.validation.beta_email.checks.email === false}"',
                '                    class="left-align invalid__msg margin-bottom-xsmall"></div>',
                '                <recaptcha ng-show="vm.beta_email" class="margin-top-xsmall margin-bottom-xsmall">',
                '                </recaptcha>',
                '                <div i18n="admin/missing_captcha"',
                '                    ng-class="{invalid: vm.validation.beta_email.checks.email && vm.validation.beta_email.checks.recaptcha === false}"',
                '                    class="left-align invalid__msg margin-bottom-xsmall"></div>',
                '                <button class="full-soan block"',
                '                    ng-click="submit_beta_email()"',
                '                    i18n="admin/submit"></button>',
                '            </section>',

                '            <section ng-show="vm.show_login">',
                '                <h4 class="bold margin-top-xlarge margin-bottom-small"',
                '                    i18n="admin/already_signed_up"></h4>',
                '                <button class="button--social-linkedin full-soan block"',
                '                    ng-click="with_linkedin()">',
                '                    <img alt="" src="/assets/images/linkedin.png" />',
                '                    <span i18n="admin/continue_with_service"',
                '                        data="{service: \'LinkedIn\'}"></span>',
                '                </button>',
                '            </section>',
                '        </div>',
                '    </popover>',

                '    <header class="site-content--span">',
                '        <img class="tcp-logo" alt="cp-logo" ng-click="nav.home()"',
                '            src="/assets/images/brand/consumrproject-black-stamp.png" />',
                '        <img class="tcp-long-logo" alt="consumrproject-logo"',
                '            src="/assets/images/brand/consumrproject-text.png" />',

                '        <button ng-if="!session.logged_in" ng-click="login()"',
                '            i18n="admin/sing_in_or_up" class="right animated fadeIn"></button>',

                '        <avatar',
                '            ng-if="session.logged_in"',
                '            class="right no-outline"',
                '            ng-click="actions.show = true"',
                '            email="{{session.email}}"',
                '            data-main-user-avatar',
                '        ></avatar>',

                '        <button class="right margin-right-small animated fadeIn button--circlular no-outline"',
                '            data-main-user-notifications-counter ng-click="show_notifications()"',
                '            ng-if="session.logged_in && session.notification_count">{{session.notification_count}}</button>',

                '        <button class="right margin-right-small animated fadeIn button--circlular button--unselected imgview imgview--bell no-outline"',
                '            data-main-user-notifications-counter',
                '            ng-if="session.logged_in && !session.has_notifications"></button>',

                '        <button class="right margin-right-small animated fadeIn button--circlular button--unselected imgview imgview--bell no-outline"',
                '            data-main-user-notifications-counter ng-click="show_notifications()"',
                '            ng-if="session.logged_in && session.has_notifications && !session.notification_count"></button>',

                '        <button class="search-button right margin-right-small animated fadeIn screen-small-only"',
                '            ng-click="nav.search()"></button>',

                '        <search class="desktop-only right margin-right-small"',
                '            redirects="true" ng-if="!nav.search.included"></search>',
                '    </header>',

                '    <popover',
                '        anchored',
                '        anchored-element="\'[data-main-user-notifications-counter]\'"',
                '        anchored-show="notifications.show"',
                '        anchored-placement="bottom-right"',
                '        anchored-top-offset="10"',
                '        anchored-arrow="true"',
                '        anchored-auto-hide="true"',
                '    >',
                '        <notifications ng-if="user.id && session.logged_in" api="notifications"></notifications>',
                '    </popover>',

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
                '        <popover-item ng-if="vm.show_admin" ng-click="nav.admin(); actions.show = false;" i18n="pages/admin"></popover-item>',
                '        <popover-item ng-click="nav.profile(); actions.show = false;" i18n="pages/profile"></popover-item>',
                '        <popover-item ng-click="logout()" i18n="admin/logout"></popover-item>',
                '    </popover>',
                '</div>'
            ].join('')
        };
    }
]);
