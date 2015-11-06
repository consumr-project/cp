/**
 * @attribute {Object} popoverApi reference to populate with show/hide api
 *
 * @attribute {Boolean} popoverBackdrop include a backdrop element
 */
angular.module('tcp').directive('popover', [function () {
    'use strict';

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

            function hide() {
                backdrop.hide();
                elem.hide();
            }

            function apiHide() {
                backdrop.css({ opacity: 0 })
                    .one(TRANSITION_END, hide);

                elem.css({ opacity: 0 })
                    .one(TRANSITION_END, hide);

                return api;
            }

            function apiShow() {
                scope.$eval(attrs.ngInit);

                backdrop.show()
                    .off(TRANSITION_END, hide)
                    .css({ opacity: 1 });

                elem.show()
                    .off(TRANSITION_END, hide)
                    .css({ opacity: 1 });

                return api;
            }

            hide();
        }
    };
}]);
