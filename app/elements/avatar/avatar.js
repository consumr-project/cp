angular.module('tcp').directive('avatar', function () {
    'use strict';

    function url(url_str) {
        return ['url(', url_str, ')'].join('');
    }

    return {
        template: '<div class="avatar--image animated fadeIn"></div>',
        link: function (scope, elem, attrs) {
            var title = [];

            elem.attr('tabindex', '0');
            elem.addClass('is-clickable is-non-selectable');

            if (attrs.image) {
                elem.find('.avatar--image').css('background-image', url(attrs.image));
            }

            if (attrs.name) {
                title.push(attrs.name);
                angular.element('<div class="avatar--name"></div>')
                    .text(attrs.name)
                    .appendTo(elem);
            }

            if (attrs.title) {
                title.push(attrs.title);
                angular.element('<div class="avatar--title"></div>')
                    .text(attrs.title)
                    .appendTo(elem);
            }

            elem.attr('title', title.join(' - '));
        }
    };
});
