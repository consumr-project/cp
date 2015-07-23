angular.module('tcp').directive('toc', function () {
    'use strict';

    return {
        template: '<div class="toc--items"></div>',
        link: function (scope, elem) {
            var $items = elem.find('.toc--items'),
                $body = angular.element('html, body');

            angular.element('[guide-section]').each(function () {
                var $this = angular.element(this),
                    label = $this.text();

                angular.element('<div></div>')
                    .text(label)
                    .appendTo($items)
                    .addClass('toc--item')
                    .attr('tabindex', '0')
                    .on('click keypress', function () {
                        $body.animate({
                            scrollTop: $this.offset().top - 30
                        }, 700, 'swing');
                    });
            });
        }
    };
});
