angular.module('tcp').directive('tags', function () {
    'use strict';

    var STATE_HIDDEN = 0,
        STATE_SHOWING = 1;

    var TRANSITION_END = [
        'webkitTransitionEnd',
        'otransitionend',
        'oTransitionEnd',
        'msTransitionEnd',
        'transitionend'
    ].join(' ');

    return {
        transclude: true,
        template: [
            '<button class="text" ng-click="toggleTags()">',
                '<span class="icon-plus"></span>',
                '<span class="tags__label">tags</span>',
            '</button>',
            '<div class="tags__tags">',
                '<ng-transclude></ng-transclude>',
            '</div>'
        ].join(''),
        link: function (scope, elem) {
            var $tags = elem.find('.tags__tags'),
                state = STATE_SHOWING,
                height;

            function hide() {
                height = $tags[0].scrollHeight;

                $tags
                    .css({ opacity: 0 })
                    .one(TRANSITION_END, function () {
                        $tags.height(height);
                        $tags.children().hide();
                        $tags.height(0);
                        state = STATE_HIDDEN;
                    });
            }

            function show() {
                $tags
                    .height(height)
                    .one(TRANSITION_END, function () {
                        $tags.css({ opacity: 1 });
                        $tags.children().show();
                        state = STATE_SHOWING;
                    });
            }

            scope.toggleTags = function () {
                switch (state) {
                    case STATE_SHOWING:
                        hide();
                        break;

                    case STATE_HIDDEN:
                        show();
                        break;
                }
            };
        }
    };
});
