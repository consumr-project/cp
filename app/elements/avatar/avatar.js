angular.module('tcp').directive('avatar', function () {
    'use strict';

    function url(url) {
        return ['url(', url, ')'].join('');
    }

    return {
        template: '<div class="avatar--image"></div>',
        link: function (scope, elem, attrs) {
            elem.attr('tabindex', '0');
            elem.addClass('is-clickable is-non-selectable');

            if (attrs.image) {
                elem.find('.avatar--image').css('background-image', url(attrs.image));
            }

            if (attrs.name) {
                angular.element('<div class="avatar--name"></div>')
                    .text(attrs.name)
                    .appendTo(elem);
            }

            if (attrs.title) {
                angular.element('<div class="avatar--title"></div>')
                    .text(attrs.title)
                    .appendTo(elem);
            }
        }
    };
});
