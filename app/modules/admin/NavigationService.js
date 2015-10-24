angular.module('tcp').service('NavigationService', ['$location', function ($location) {
    'use strict';

    var BASES = {
        COMPANY: '/company',
        HOME: '/',
        SEARCH: '/search',
        USER: '/user'
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
        company: withoid(BASES.COMPANY),
        home: withoid(BASES.HOME),
        user: withoid(BASES.USER),

        /**
         * are you in one of these pages?
         * @param {String[]} pages
         * @return {Boolean}
         */
        oneOf: function (pages) {
            var path = $location.path();
            return pages.indexOf(path) !== -1;
        }
    };
}]);
