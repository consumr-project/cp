angular.module('tcp').directive('message', [
    'lodash',
    function (_) {
        'use strict';

        return {
            replace: true,
            transclude: true,

            template: [
                '<div class="message-elem animated fadeIn">',
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
