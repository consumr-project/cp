angular.module('tcp').directive('popover', ['$document', function ($document) {
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
            var api;

            function hide() {
                console.log("S");
                elem.hide();
            }

            if (attrs.popoverApi) {
                api = scope[attrs.popoverApi] = scope[attrs.popoverApi] || {};

                api.hide = function () {
                    elem.css({ opacity: 0 })
                        .one(TRANSITION_END, hide);

                    return api;
                };

                api.show = function () {
                    scope.$eval(attrs.ngInit);

                    elem.show()
                        .off(TRANSITION_END, hide)
                        .css({ opacity: 1 });

                    return api;
                };
            }
        }
    };
}]);
