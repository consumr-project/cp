angular.module('tcp').directive('avatar', ['Navigation', function (Navigation) {
    'use strict';

    var template =
        '<div>' +
            '<div class="avatar__image animated fadeIn" afkl-lazy-image="{{src}}" afkl-lazy-image-options="{background: true}">' +
                '<div ng-transclude="logo"></div>' +
            '</div>' +
            '<div ng-transclude="body"></div>' +
        '</div>';

    /**
     * @param {String} url_str
     * @return {String}
     */
    function url(url_str) {
        return ['url(', url_str, ')'].join('');
    }

    /**
     * @param {String} type
     * @param {String} value
     * @return {String}
     */
    function avatar(type, value) {
        return '/service/user/avatar?' + type + '=' + value;
    }

    /**
     * @param {angular.Scope} scope
     * @param {jQuery} elem
     * @param {angular.Attributes} attrs
     */
    function link(scope, elem, attrs) {
        var title = [];

        if (attrs.image) {
            scope.src = attrs.image;
        } else if (attrs.email) {
            scope.src = avatar('email', attrs.email);
        } else if (attrs.userId) {
            scope.src = avatar('id', attrs.userId);
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

        if (attrs.userId) {
            elem.find('.avatar__image')
                .addClass('clickable')
                .click(Navigation.user.bind(null, attrs.userId));
        }

        elem.attr('title', title.join(' - '));
    }

    return {
        restrict: 'E',
        transclude: true,
        template: template,
        link: link,
        transclude: {
            logo: '?avatarLogo',
            body: '?avatarBody',
        },
        scope: {
            src: '@',
        }
    };
}]);
