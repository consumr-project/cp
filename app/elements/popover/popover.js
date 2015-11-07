/**
 * @attribute {Object} popoverApi reference to populate with show/hide api
 *
 * @attribute {Boolean} popoverBackdrop include a backdrop element
 */
angular.module('tcp').directive('popover', [function () {
    'use strict';

    var ACTION_SHOW = {
        opacity: 1
    };

    var ACTION_HIDE = {
        opacity: 0
    };

    var TRANSITION_END = [
        'webkitTransitionEnd',
        'otransitionend',
        'oTransitionEnd',
        'msTransitionEnd',
        'transitionend'
    ].join(' ');

    return {
        replace: true,
        transclude: true,
        template: '<div class="popover"><ng-transclude></ng-transclude></div>',
        link: function (scope, elem, attrs) {
            var api, backdrop = $();

            if ('popoverBackdrop' in attrs) {
                backdrop = $('<div></div>')
                    .addClass('popover__backdrop')
                    .prependTo('body');

                elem.addClass('popover--with-backdrop');
                backdrop.click(apiHide);
            }

            if (attrs.popoverApi) {
                api = scope[attrs.popoverApi] = scope[attrs.popoverApi] || {};
                api.hide = apiHide;
                api.show = apiShow;
            }

            hide();

            /**
             * sets initial hidden state
             */
            function hide() {
                backdrop.hide();
                elem.hide();
                elem.css({ opacity: 0 });
            }

            /**
             * starts to hide an element
             * @param {jQuery} elem
             */
            function elemHide(elem) {
                elem.css(ACTION_HIDE)
                    .one(TRANSITION_END, hide);
            }

            /**
             * starts to show an element
             * @param {jQuery} elem
             */
            function elemShow(elem, delay) {
                elem.off(TRANSITION_END, hide)
                    .show();

                setTimeout(function () {
                    elem.off(TRANSITION_END, hide)
                        .css(ACTION_SHOW);
                }, delay);
            }

            function apiHide() {
                elemHide(backdrop);
                elemHide(elem);
                return api;
            }

            function apiShow() {
                scope.$eval(attrs.ngInit);

                elemShow(backdrop, 10);
                elemShow(elem, 70);

                return api;
            }
        }
    };
}]);
