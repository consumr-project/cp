angular.module('tcp').directive('recaptcha', ['CONFIG', function (CONFIG) {
    'use strict';

    var template = angular.element('<div><div>')
        .children()
        .attr('data-sitekey', CONFIG.google.recaptcha.key)
        .attr('class', 'g-recaptcha')
        .end()
        .html();

    return {
        replace: true,
        template: template,
    };
}]);
