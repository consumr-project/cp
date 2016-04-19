angular.module('tcp').directive('avatar', function () {
    'use strict';

    var template =
        '<div class="avatar__image animated fadeIn" afkl-lazy-image="{{src}}" afkl-lazy-image-options="{background: true}">' +
            '<ng-transclude></ng-transclude>' +
        '</div>';

    /**
     * @param {String} url_str
     * @return {String}
     */
    function url(url_str) {
        return ['url(', url_str, ')'].join('');
    }

    /**
     * @param {String} email address
     * @return {String}
     */
    function avatar(email) {
        return '/service/user/avatar?email=' + email;
    }

    /**
     * @param {angular.Scope} scope
     * @param {jQuery} elem
     * @param {angular.Attributes} attrs
     */
    function link(scope, elem, attrs) {
        var title = [];

        if (attrs.image) {
            // elem.find('.avatar__image').css('background-image', url(attrs.image));
            scope.src = attrs.image;
        } else if (attrs.email) {
            // elem.find('.avatar__image').css('background-image', url(avatar(attrs.email)));
            scope.src = avatar(attrs.email);
        }

        if (attrs.name) {
            title.push(attrs.name);
            angular.element('<div class="avatar__name"></div>')
                .text(attrs.name)
                .appendTo(elem);
        }

        if (attrs.title) {
            title.push(attrs.title);
            angular.element('<div class="avatar__title"></div>')
                .text(attrs.title)
                .appendTo(elem);
        }

        if (attrs.summary) {
            angular.element('<div class="avatar__summary copy"></div>')
                .text(attrs.summary)
                .appendTo(elem);
        }

        elem.attr('title', title.join(' - '));
    }

    return {
        transclude: true,
        template: template,
        link: link
    };
});
