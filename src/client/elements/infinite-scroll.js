/**
 * @attribute {Function} infiniteScroll destination reached handler
 * @attribute {number} infiniteScrollOffset how far from the bottoms should we
 * get before running the handler
 */
angular.module('tcp').directive('infiniteScroll', [
    '$window',
    '$document',
    'lodash',
    function ($window, $document, lodash) {
        'use strict';

        var DEF_OFFSET = 500;
        var CHECK_THROTTLE = 50;

        /**
         * @param {jQuery} elem
         * @return {number}
         */
        function get_offset(elem) {
            return $document[0].body.clientHeight - elem.get(0).getBoundingClientRect().bottom;
        }

        /**
         * @param {Angular.Scope} scope
         * @param {jQuery} elem
         * @param {Angular.Attributes} attrs
         */
        function link(scope, elem, attrs) {
            var dest_check = _.debounce(function () {
                var cur = Math.abs(get_offset(elem));
                var end = attrs.infiniteScrollOffset;

                if (cur < end) {
                    scope.infiniteScroll();
                }
            }, CHECK_THROTTLE);

            attrs.infiniteScrollOffset = +(attrs.infiniteScrollOffset || DEF_OFFSET);

            angular.element($window).on('resize', dest_check);
            angular.element($document).on('scroll', dest_check);

            scope.$on('$destroy', function () {
                angular.element($window).off('resize', dest_check);
                angular.element($document).off('scroll', dest_check);
            });
        }

        return {
            restrict: 'A',
            link: link,
            scope: { infiniteScroll: '&' }
        };
    }
]);
