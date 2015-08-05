angular.module('tcp').directive('message', [
    'lodash',
    function (_) {
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

            template: [
                '<div class="message-elem">',
                    '<b class="message-elem__title"></b>',
                    '<ng-transclude></ng-transclude>',
                '</div>',
            ].join(''),

            link: function (scope, elem, attr) {
                elem.addClass('message-elem--' + attr.type);
                elem.find('.message-elem__title').text(_.capitalize(attr.type) + ': ');
            }
        };
    }
]);
