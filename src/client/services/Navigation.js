angular.module('tcp').service('Navigation', [
    '$location',
    function ($location) {
        'use strict';

        var BASES = {
            COMPANY: '/company',
            TAG: '/tag',
            HOME: '/',
            SEARCH: '/search',
            USER: '/user',
            EVENT: '/event',
            BY_ID: '/id',
            BY_ME: '/me',
        };

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

        return {
            BASES: BASES,

            /**
             * reroute functions:
             * @param {String} [id]
             */
            tag: withoid(BASES.TAG),
            company: withoid(BASES.COMPANY),
            company_by_id: withoid(BASES.COMPANY + BASES.BY_ID),
            home: withoid(BASES.HOME),
            user: withoid(BASES.USER),
            user_me: withoid(BASES.USER + BASES.BY_ME),
            event: withoid(BASES.EVENT),

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
            }
        };
    }
]);
