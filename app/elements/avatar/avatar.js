angular.module('tcp').directive('avatar', function () {
    'use strict';

    function url(url_str) {
        return ['url(', url_str, ')'].join('');
    }

    return {
        template: '<div class="avatar__image animated fadeIn"></div>',
        link: function (scope, elem, attrs) {
            var title = [];

            if (attrs.image) {
                elem.find('.avatar__image').css('background-image', url(attrs.image));
            }

            if (attrs.name) {
                title.push(attrs.name);
                angular.element('<div class="avatar__name"></div>')
                    .text(attrs.name)
                    .appendTo(elem);
            }

            if (attrs.title) {
                title.push(attrs.title);
                angular.element('<div class="avatar__title copy"></div>')
                    .text(attrs.title)
                    .appendTo(elem);
            }

            elem.attr('title', title.join(' - '));
        }
    };
});
