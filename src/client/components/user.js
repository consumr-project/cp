angular.module('tcp').directive('user', [
    'Services',
    'Session',
    'Navigation',
    'assert',
    'utils2',
    'lodash',
    '$q',
    '$location',
    '$routeParams',
    function (Services, Session, Navigation, assert, utils2, lodash, $q, $location, $routeParams) {
        'use strict';

        var STAT_MAP = {},
            STAT_CHILD_MAP = {},
            STAT_GETTER_MAP = {};

        var STAT_CONTRIBUTIONS = 1,
            STAT_FOLLOWING = 2;

        var STAT_FOLLOWERS = 3,
            STAT_FOLLOWERS_USERS = 13;

        var STAT_FAVORITES = 4,
            STAT_FAVORITES_EVENTS = 14;

        var STAT_CONTRIBUTIONS_EVENTS = 5,
            STAT_CONTRIBUTIONS_QUESTIONS = 6,
            STAT_CONTRIBUTIONS_COMPANIES = 7,
            STAT_CONTRIBUTIONS_SOURCES = 8,
            STAT_CONTRIBUTIONS_REVIEWS = 9;

        var STAT_FOLLOWING_COMPANIES = 10,
            STAT_FOLLOWING_USERS = 11,
            STAT_FOLLOWING_TAGS = 12;

        STAT_GETTER_MAP[STAT_CONTRIBUTIONS_EVENTS] = Services.query.users.stats.contributions.events;
        STAT_GETTER_MAP[STAT_CONTRIBUTIONS_REVIEWS] = Services.query.users.stats.contributions.reviews;
        STAT_GETTER_MAP[STAT_CONTRIBUTIONS_SOURCES] = Services.query.users.stats.contributions.sources;
        STAT_GETTER_MAP[STAT_CONTRIBUTIONS_COMPANIES] = Services.query.users.stats.contributions.companies;
        STAT_GETTER_MAP[STAT_CONTRIBUTIONS_QUESTIONS] = Services.query.users.stats.contributions.questions;
        STAT_GETTER_MAP[STAT_FOLLOWING_USERS] = Services.query.users.stats.following.users;
        STAT_GETTER_MAP[STAT_FOLLOWING_COMPANIES] = Services.query.users.stats.following.companies;
        STAT_GETTER_MAP[STAT_FOLLOWING_TAGS] = Services.query.users.stats.following.tags;
        STAT_GETTER_MAP[STAT_FOLLOWERS_USERS] = Services.query.users.stats.followers.users;
        STAT_GETTER_MAP[STAT_FAVORITES_EVENTS] = Services.query.users.stats.favorites.events;

        STAT_MAP[STAT_CONTRIBUTIONS] = STAT_CONTRIBUTIONS;
        STAT_MAP[STAT_CONTRIBUTIONS_COMPANIES] = STAT_CONTRIBUTIONS;
        STAT_MAP[STAT_CONTRIBUTIONS_EVENTS] = STAT_CONTRIBUTIONS;
        STAT_MAP[STAT_CONTRIBUTIONS_QUESTIONS] = STAT_CONTRIBUTIONS;
        STAT_MAP[STAT_CONTRIBUTIONS_REVIEWS] = STAT_CONTRIBUTIONS;
        STAT_MAP[STAT_CONTRIBUTIONS_SOURCES] = STAT_CONTRIBUTIONS;
        STAT_MAP[STAT_FOLLOWING] = STAT_FOLLOWING;
        STAT_MAP[STAT_FOLLOWING_COMPANIES] = STAT_FOLLOWING;
        STAT_MAP[STAT_FOLLOWING_TAGS] = STAT_FOLLOWING;
        STAT_MAP[STAT_FOLLOWING_USERS] = STAT_FOLLOWING;
        STAT_MAP[STAT_FAVORITES] = STAT_FAVORITES;
        STAT_MAP[STAT_FAVORITES_EVENTS] = STAT_FAVORITES;
        STAT_MAP[STAT_FOLLOWERS] = STAT_FOLLOWERS;
        STAT_MAP[STAT_FOLLOWERS_USERS] = STAT_FOLLOWERS;

        STAT_CHILD_MAP[STAT_CONTRIBUTIONS] = STAT_CONTRIBUTIONS_EVENTS;
        STAT_CHILD_MAP[STAT_CONTRIBUTIONS_COMPANIES] = STAT_CONTRIBUTIONS_COMPANIES;
        STAT_CHILD_MAP[STAT_CONTRIBUTIONS_EVENTS] = STAT_CONTRIBUTIONS_EVENTS;
        STAT_CHILD_MAP[STAT_CONTRIBUTIONS_QUESTIONS] = STAT_CONTRIBUTIONS_QUESTIONS;
        STAT_CHILD_MAP[STAT_CONTRIBUTIONS_REVIEWS] = STAT_CONTRIBUTIONS_REVIEWS;
        STAT_CHILD_MAP[STAT_CONTRIBUTIONS_SOURCES] = STAT_CONTRIBUTIONS_SOURCES;
        STAT_CHILD_MAP[STAT_FOLLOWING] = STAT_FOLLOWING_COMPANIES;
        STAT_CHILD_MAP[STAT_FOLLOWING_COMPANIES] = STAT_FOLLOWING_COMPANIES;
        STAT_CHILD_MAP[STAT_FOLLOWING_TAGS] = STAT_FOLLOWING_TAGS;
        STAT_CHILD_MAP[STAT_FOLLOWING_USERS] = STAT_FOLLOWING_USERS;
        STAT_CHILD_MAP[STAT_FAVORITES] = STAT_FAVORITES_EVENTS;
        STAT_CHILD_MAP[STAT_FAVORITES_EVENTS] = STAT_FAVORITES_EVENTS;
        STAT_CHILD_MAP[STAT_FOLLOWERS] = STAT_FOLLOWERS_USERS;
        STAT_CHILD_MAP[STAT_FOLLOWERS_USERS] = STAT_FOLLOWERS_USERS;

        /**
         * @param {STAT} exp_stat
         * @return {String}
         */
        function get_stat_path(exp_stat) {
            var curr = $location.path().split('/'),
                parts = [curr[1], curr[2]];

            switch (exp_stat) {
                case STAT_FOLLOWERS_USERS:
                    parts.push('followers/users');
                    break;

                case STAT_FAVORITES_EVENTS:
                    parts.push('favorites/events');
                    break;

                case STAT_FOLLOWING_TAGS:
                    parts.push('following/tags');
                    break;

                case STAT_FOLLOWING_COMPANIES:
                    parts.push('following/companies');
                    break;

                case STAT_FOLLOWING_USERS:
                    parts.push('following/users');
                    break;

                case STAT_CONTRIBUTIONS_EVENTS:
                    parts.push('contributions/events');
                    break;

                case STAT_CONTRIBUTIONS_QUESTIONS:
                    parts.push('contributions/questions');
                    break;

                case STAT_CONTRIBUTIONS_COMPANIES:
                    parts.push('contributions/companies');
                    break;

                case STAT_CONTRIBUTIONS_SOURCES:
                    parts.push('contributions/sources');
                    break;

                case STAT_CONTRIBUTIONS_REVIEWS:
                    parts.push('contributions/reviews');
                    break;
            }

            return '/' + parts.join('/');
        }

        /**
         * @param {Object}
         */
        function get_stat_to_load() {
            var cur_stat = STAT_CONTRIBUTIONS,
                exp_stat = STAT_CONTRIBUTIONS_EVENTS;

            switch ($routeParams.category) {
                case 'contributions':
                    cur_stat = STAT_CONTRIBUTIONS;
                    exp_stat = STAT_CHILD_MAP[cur_stat];
                    break;

                case 'following':
                    cur_stat = STAT_FOLLOWING;
                    exp_stat = STAT_CHILD_MAP[cur_stat];
                    break;

                case 'followers':
                    cur_stat = STAT_FOLLOWERS;
                    exp_stat = STAT_CHILD_MAP[cur_stat];
                    break;

                case 'favorites':
                    cur_stat = STAT_FAVORITES;
                    exp_stat = STAT_CHILD_MAP[cur_stat];
                    break;
            }

            switch (cur_stat + $routeParams.subcategory) {
                case STAT_CONTRIBUTIONS + 'events':
                    exp_stat = STAT_CONTRIBUTIONS_EVENTS;
                    break;

                case STAT_CONTRIBUTIONS + 'questions':
                    exp_stat = STAT_CONTRIBUTIONS_QUESTIONS;
                    break;

                case STAT_CONTRIBUTIONS + 'companies':
                    exp_stat = STAT_CONTRIBUTIONS_COMPANIES;
                    break;

                case STAT_CONTRIBUTIONS + 'sources':
                    exp_stat = STAT_CONTRIBUTIONS_SOURCES;
                    break;

                case STAT_CONTRIBUTIONS + 'reviews':
                    exp_stat = STAT_CONTRIBUTIONS_REVIEWS;
                    break;

                case STAT_FOLLOWING + 'companies':
                    exp_stat = STAT_FOLLOWING_COMPANIES;
                    break;

                case STAT_FOLLOWING + 'users':
                    exp_stat = STAT_FOLLOWING_USERS;
                    break;

                case STAT_FOLLOWING + 'tags':
                    exp_stat = STAT_FOLLOWING_TAGS;
                    break;

                case STAT_FAVORITES + 'events':
                    exp_stat = STAT_FAVORITES_EVENTS;
                    break;

                case STAT_FOLLOWERS + 'users':
                    exp_stat = STAT_FOLLOWERS_USERS;
                    break;
            }

            return {
                cur_stat: cur_stat,
                exp_stat: exp_stat,
            };
        }

        function controller($scope) {
            var update_email = lodash.debounce(update_email_now, 300);

            $scope.STAT_CONTRIBUTIONS = STAT_CONTRIBUTIONS;
            $scope.STAT_FOLLOWING = STAT_FOLLOWING;

            $scope.STAT_FAVORITES = STAT_FAVORITES;
            $scope.STAT_FAVORITES_EVENTS = STAT_FAVORITES_EVENTS;

            $scope.STAT_FOLLOWERS = STAT_FOLLOWERS;
            $scope.STAT_FOLLOWERS_USERS = STAT_FOLLOWERS_USERS;

            $scope.STAT_CONTRIBUTIONS_EVENTS = STAT_CONTRIBUTIONS_EVENTS;
            $scope.STAT_CONTRIBUTIONS_QUESTIONS = STAT_CONTRIBUTIONS_QUESTIONS;
            $scope.STAT_CONTRIBUTIONS_COMPANIES = STAT_CONTRIBUTIONS_COMPANIES;
            $scope.STAT_CONTRIBUTIONS_SOURCES = STAT_CONTRIBUTIONS_SOURCES;
            $scope.STAT_CONTRIBUTIONS_REVIEWS = STAT_CONTRIBUTIONS_REVIEWS;

            $scope.STAT_FOLLOWING_COMPANIES = STAT_FOLLOWING_COMPANIES;
            $scope.STAT_FOLLOWING_USERS = STAT_FOLLOWING_USERS;
            $scope.STAT_FOLLOWING_TAGS = STAT_FOLLOWING_TAGS;

            $scope.nav = Navigation;
            $scope.vm = {
                user: {},
                upload_photo: {},
                stats: null,
                cur_stat: null,
                exp_stat: null,
                stats_data: [],
                followed_by_me: null,
            };

            /**
             * @param {String} id
             * @return {Promise}
             */
            function load(id) {
                var loc = get_stat_to_load();

                return Services.query.users.retrieve(id, ['followers']).then(function (user) {
                    $scope.vm.user = user;
                    $scope.vm.user.raw_email = ' ';
                    $scope.vm.followed_by_me = user.followers['@meta'].instead.includes_me;

                    if (viewing_myself()) {
                        Services.auth.get_user_email()
                            .then(function (email) {
                                $scope.vm.user.raw_email = email;
                                $scope.vm.user.raw_email_curr = email;
                            });
                    }

                    Services.query.users.stats(id)
                        .then(utils2.curr_set($scope, 'vm.stats'));

                    $scope.vm.cur_stat = loc.cur_stat;
                    $scope.vm.exp_stat = loc.exp_stat;

                    $scope.load_stat(loc.exp_stat);
                });
            }

            /**
             * what can be done in this page?
             */
            function update_actionable_items() {
                $scope.vm.loggedin = !!Session.USER.id;
                $scope.vm.myself = viewing_myself();
            }

            /**
             * @return {boolean}
             */
            function viewing_myself() {
                return $scope.id === Session.USER.id;
            }

            /**
             * @param {string} new_email
             * @return {void}
             */
            function email_updated(new_email) {
                var old_email;

                old_email = normalized_email($scope.vm.user.raw_email_curr);
                new_email = normalized_email(new_email);

                if (new_email && new_email !== old_email) {
                    $scope.vm.user.raw_email_curr = new_email;
                    update_email(new_email);
                }
            }

            /**
             * @param {string} email
             * @return {Promise<UserMessage>}
             */
            function update_email_now(email) {
                console.log('updating user email to %s', email);
                return Services.auth.set_user_email(email);
            }

            /**
             * @param {String} user_id
             * @return {Promise}
             */
            $scope.on_start_following = function (user_id) {
                assert(user_id, 'nothing to follow');
                assert(Session.USER, 'must be logged in');
                assert(Session.USER.id, 'must be logged in');

                return Services.query.users.followers.upsert(user_id, { user_id: Session.USER.id })
                    .then(utils2.curr_set($scope, 'vm.followed_by_me', true))
                    .then(Services.notification.notify.follow.bind(null, user_id));
            };

            /**
             * @param {String} user_id
             * @return {Promise}
             */
            $scope.on_stop_following = function (user_id) {
                assert(user_id, 'nothing to unfollow');
                assert(Session.USER, 'must be logged in');
                assert(Session.USER.id, 'must be logged in');

                return Services.query.users.followers.delete(user_id, Session.USER.id)
                    .then(utils2.curr_set($scope, 'vm.followed_by_me', false))
                    .then(Services.notification.notify.unfollow.bind(null, user_id));
            };

            $scope.load_stat = function (stat) {
                var req = STAT_CHILD_MAP[stat] in STAT_GETTER_MAP ?
                    STAT_GETTER_MAP[STAT_CHILD_MAP[stat]]($scope.id) : $q.when([]);

                var path = get_stat_path(STAT_CHILD_MAP[stat]);

                $scope.vm.cur_stat = STAT_MAP[stat];
                $scope.vm.exp_stat = STAT_CHILD_MAP[stat];
                req.then(utils2.curr_set($scope, 'vm.stats_data'));

                if (stat === STAT_CONTRIBUTIONS_EVENTS) {
                    return;
                }

                $location.path(path, false);
            };

            if ($scope.id) {
                update_actionable_items();
                load($scope.id);
            }

            if ($scope.id && viewing_myself()) {
                $scope.$watch('vm.user.raw_email', email_updated);
            }

            Session.on(Session.EVENT.LOGIN, update_actionable_items);
            Session.on(Session.EVENT.LOGOUT, update_actionable_items);
        }

        /**
         * @param {string} str
         * @return {string}
         */
        function normalized_email(str) {
            return !str ? '' : str.toLowerCase().trim();
        }

        return {
            replace: true,
            controller: ['$scope', controller],
            scope: {
                id: '@'
            },
            template: [
                '<div class="user-component">',
                '    <popover',
                '        with-close-x',
                '        with-backdrop',
                '        api="vm.upload_photo" ',
                '        class="popover--with-content">',
                '            <img-upload></img-upload>',
                '    </popover>',

                '    <center ng-if="vm.user.id" class="margin-top-large">',
                '        <avatar class="avatar--block"',
                '            title="{{::vm.user.title}}" name="{{::vm.user.name}}"',
                '            email="{{::vm.user.email}}"',
                '        >',
                '            <avatar-logo ng-if="vm.myself" ng-click="vm.upload_photo.show()">',
                '                <div class="user-component__logo"></div>',
                '            </avatar-logo>',
                '            <avatar-body ng-if="vm.myself">',
                '                <div class="user-component__email"',
                '                    ng-contenteditable="true"',
                '                    ng-model="vm.user.raw_email"></div>',
                '            </avatar-body>',
                '        </avatar>',

                '        <p class="uppercase" i18n="user/member_number"',
                '            data="{num: vm.user.member_number}"></p>',

                '        <div ng-invisible="vm.myself || !vm.loggedin"',
                '            class="block margin-top-xlarge margin-bottom-xlarge">',
                '            <button class="button--unselected"',
                '                ng-click="on_start_following(vm.user.id)"',
                '                ng-if="vm.followed_by_me === false"',
                '                i18n="admin/follow"></button>',
                '            <button',
                '                ng-click="on_stop_following(vm.user.id)"',
                '                ng-if="vm.followed_by_me === true"',
                '                i18n="admin/unfollow"></button>',
                '        </div>',

                '        <section ng-if="vm.stats">',
                '            <snav value="vm.cur_stat">',
                '                <snav-item value="{{STAT_CONTRIBUTIONS}}" ng-click="load_stat(STAT_CONTRIBUTIONS)" i18n="user/contributions" data="{count: vm.stats.contributions}"></snav-item>',
                '                <snav-item value="{{STAT_FOLLOWING}}" ng-click="load_stat(STAT_FOLLOWING)" i18n="user/following" data="{count: vm.stats.following}"></snav-item>',
                '                <snav-item value="{{STAT_FOLLOWERS}}" ng-click="load_stat(STAT_FOLLOWERS)" i18n="user/followers" data="{count: vm.stats.followers}"></snav-item>',
                '                <snav-item value="{{STAT_FAVORITES}}" ng-click="load_stat(STAT_FAVORITES)" i18n="user/favorites" data="{count: vm.stats.favorites}"></snav-item>',
                '            </snav>',

                '            <snav value="vm.exp_stat" ng-show="vm.cur_stat === STAT_CONTRIBUTIONS">',
                '                <snav-item value="{{STAT_CONTRIBUTIONS_EVENTS}}" ng-click="load_stat(STAT_CONTRIBUTIONS_EVENTS)" i18n="user/contributions_events" data="{count: vm.stats.contributions_events}"></snav-item>',
                '                <snav-item value="{{STAT_CONTRIBUTIONS_QUESTIONS}}" ng-click="load_stat(STAT_CONTRIBUTIONS_QUESTIONS)" i18n="user/contributions_questions" data="{count: vm.stats.contributions_questions}"></snav-item>',
                '                <snav-item value="{{STAT_CONTRIBUTIONS_COMPANIES}}" ng-click="load_stat(STAT_CONTRIBUTIONS_COMPANIES)" i18n="user/contributions_companies" data="{count: vm.stats.contributions_companies}"></snav-item>',
                '                <snav-item value="{{STAT_CONTRIBUTIONS_REVIEWS}}" ng-click="load_stat(STAT_CONTRIBUTIONS_REVIEWS)" i18n="user/contributions_reviews" data="{count: vm.stats.contributions_reviews}"></snav-item>',
                '                <snav-item value="{{STAT_CONTRIBUTIONS_SOURCES}}" ng-click="load_stat(STAT_CONTRIBUTIONS_SOURCES)" i18n="user/contributions_sources" data="{count: vm.stats.contributions_sources}"></snav-item>',
                '            </snav>',

                '            <snav value="vm.exp_stat" ng-show="vm.cur_stat === STAT_FOLLOWING">',
                '                <snav-item value="{{STAT_FOLLOWING_COMPANIES}}" ng-click="load_stat(STAT_FOLLOWING_COMPANIES)" i18n="user/following_companies" data="{count: vm.stats.following_companies}"></snav-item>',
                '                <snav-item value="{{STAT_FOLLOWING_USERS}}" ng-click="load_stat(STAT_FOLLOWING_USERS)" i18n="user/following_users" data="{count: vm.stats.following_users}"></snav-item>',
                '                <snav-item value="{{STAT_FOLLOWING_TAGS}}" ng-click="load_stat(STAT_FOLLOWING_TAGS)" i18n="user/following_tags" data="{count: vm.stats.following_tags}"></snav-item>',
                '            </snav>',

                '        </section>',
                '    </center>',

                '    <section class="margin-top-large">',
                '        <event ng-if="vm.exp_stat === STAT_CONTRIBUTIONS_EVENTS || vm.exp_stat === STAT_FAVORITES_EVENTS"',
                '            class="margin-top-large"',
                '            ng-repeat="ev in vm.stats_data"',
                '            api="{}"',
                '            type="view" id="{{ev.id}}"></event>',
                '        <avatar ng-if="vm.exp_stat === STAT_FOLLOWERS_USERS || vm.exp_stat === STAT_FOLLOWING_USERS"',
                '            ng-repeat="user in vm.stats_data"',
                '            ng-click="nav.user(user.id)"',
                '            class="margin-top-large block"',
                '            name="{{::user.name}}"',
                '            title="{{::user.title}}"',
                '            email="{{::user.email}}"></avatar>',
                '        <review ng-if="vm.exp_stat === STAT_CONTRIBUTIONS_REVIEWS"',
                '            ng-repeat="review in vm.stats_data"',
                '            class="margin-top-large"',
                '            model="review"',
                '            type="view"></review>',
                '        <source ng-if="vm.exp_stat === STAT_CONTRIBUTIONS_SOURCES"',
                '            ng-repeat="source in vm.stats_data"',
                '            model="source"',
                '            type="view"></source>',
                '        <company ng-if="vm.exp_stat === STAT_CONTRIBUTIONS_COMPANIES || vm.exp_stat === STAT_FOLLOWING_COMPANIES"',
                '            ng-repeat="company in vm.stats_data"',
                '            ng-click="nav.company(company.guid)"',
                '            class="margin-top-large"',
                '            model="company"',
                '            type="view"></company>',
                '        <tag-view ng-if="vm.exp_stat === STAT_FOLLOWING_TAGS"',
                '            ng-repeat="tag in vm.stats_data"',
                '            ng-click="nav.tag(tag.id)"',
                '            class="margin-top-large"',
                '            model="tag"',
                '            type="view"></tag-view>',
                '        <question ng-if="vm.exp_stat === STAT_CONTRIBUTIONS_QUESTIONS"',
                '            ng-repeat="question in vm.stats_data"',
                '            class="margin-top-large"',
                '            model="question"',
                '            type="view"></tag-view>',
                '    </section>',
                '</div>'
            ].join('')
        };
    }
]);
