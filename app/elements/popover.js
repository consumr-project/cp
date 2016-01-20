/* globals $ */

/**
 * @attribute {Object} api reference to populate with show/hide api
 *                      - showNow: show immediatelly
 *
 * @attribute {Boolean} withBackdrop include a backdrop element
 *
 * @attribute {Boolean} withCloseX include a close (x) element in top right hand
 *                      courner
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

    /**
     * @param {Object} obj
     * @param {String} property path
     * @param {*} [val]
     * @return {*}
     */
    function deep(obj, prop, val) {
        var parts = prop.split('.'),
            ref = obj;

        for (var i = 0, len = parts.length; i < len; i++) {
            if (!(parts[i] in ref)) {
                return;
            }

            ref = ref[parts[i]];
        }

        return val === undefined ? ref : ref = val;
    }

    return {
        replace: true,
        transclude: true,
        template: '<div class="popover"><ng-transclude></ng-transclude></div>',
        link: function (scope, elem, attrs) {
            var api, backdrop = $(), x_close = $();

            if ('withCloseX' in attrs) {
                x_close = $('<div></div>')
                    .addClass('popover__x')
                    .appendTo(elem);

                x_close.click(apiHide);
            }

            if ('withBackdrop' in attrs) {
                backdrop = $('<div></div>')
                    .addClass('popover__backdrop')
                    .prependTo('body');

                elem.addClass('popover--with-backdrop');
                backdrop.click(apiHide);
            }

            if (attrs.api) {
                api = deep(scope, attrs.api, deep(scope, attrs.api) || {});
                api.hide = apiHide;
                api.show = apiShow;
            }

            if (api && api.showNow) {
                apiShow();
            } else {
                hide();
            }

            scope.$on('$destroy', function () {
              backdrop.remove();
            });

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
                $('body').css({overflowY: 'initial'});
                return api;
            }

            function apiShow() {
                scope.$eval(attrs.ngInit);
                elemShow(backdrop, 10);
                elemShow(elem, 70);
                $('body').css({overflowY: 'hidden'});
                return api;
            }
        }
    };
}]);
