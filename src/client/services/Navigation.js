angular.module('tcp').service('Navigation', [
    '$location',
    function ($location) {
        'use strict';

        var BASES = {
            ADMIN: '/admin',
            COMPANY: '/company',
            TAG: '/tag',
            HOME: '/',
            SEARCH: '/search',
            USER: '/user',
            EVENT: '/event',
            EDIT: '/edit',
            BY_ID: '/id',
            BY_ME: '/me',
        };

        BASES.MY_PROFILE = BASES.USER + BASES.BY_ME;

        var PAGE_MAP = {};
        PAGE_MAP[BASES.HOME] = 'home';
        PAGE_MAP[BASES.SEARCH] = 'search';

        /**
         * optional append
         * @param {String} [next] part
         * @return {String}
         */
        function oappend(next) {
            return next ? '/' + next : '';
        }

        /**
         * generate a $location.url funciton
         * @param {String} base
         * @return {Function(String id?)}
         */
        function withoid(base) {
            return function (id) {
                $location.url(base + oappend(id));
            };
        }

        /**
         * generate a $location.url funciton
         * @param {String} base
         * @return {Function(String id?)}
         */
        function child_of(par, child) {
            return function (par_id, child_id) {
                $location.url(par + oappend(par_id) + child + oappend(child_id));
            };
        }

        return {
            BASES: BASES,

            /**
             * reroute functions:
             * @param {String} [id]
             */
            tag: withoid(BASES.TAG),
            company: withoid(BASES.COMPANY),
            company_by_id: withoid(BASES.COMPANY + BASES.BY_ID),
            admin: withoid(BASES.ADMIN),
            home: withoid(BASES.HOME),
            user: withoid(BASES.USER),
            user_me: withoid(BASES.MY_PROFILE),
            event: withoid(BASES.EVENT),

            url: {
                /**
                 * @param {string} company id
                 * @param {string} event id
                 * @return {string}
                 */
                company_event: function (cid, eid) {
                    return BASES.COMPANY +
                        BASES.BY_ID +
                        oappend(cid) +
                        BASES.EVENT +
                        oappend(eid);
                },
            },

            /**
             * @param {String} parent_id
             * @param {String} child_id
             */
            tag_by_id_event: child_of(BASES.TAG + BASES.BY_ID, BASES.EVENT),
            company_by_id_event: child_of(BASES.COMPANY + BASES.BY_ID, BASES.EVENT),
            company_edit: child_of(BASES.COMPANY + BASES.BY_ID, BASES.EDIT),

            /**
             * go to the help us out page
             */
            help_us_out: function () {
                $location.url('/thx');
            },

            /**
             * go to search
             * @param {String} query
             * @param {Event} [event]
             */
            search: function (query, event) {
                if (event) {
                    event.preventDefault();
                }

                $location.url('/search')
                    .search({ q: query });
            },

            /**
             * are you in one of these pages?
             * @param {String[]} pages
             * @return {Boolean}
             */
            one_of: function (pages) {
                var path = $location.path();
                return pages.indexOf(path) !== -1;
            },

            /**
             * @return {String}
             */
            curr_page: function () {
                return PAGE_MAP[$location.path()];
            },

            /**
             * @param {String} url
             * @return {Angular.Location}
             */
            go_to: function (url) {
                return $location.url(url);
            },
        };
    }
]);
