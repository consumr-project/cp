angular.module('tcp').directive('toc', function () {
    'use strict';

    return {
        template: '<div class="toc--items"></div>',
        link: function (scope, elem) {
            var $items = elem.find('.toc--items'),
                $body = $('html, body');

            $('[guide-section]').each(function () {
                var $this = $(this),
                    label = $this.text();

                $('<div></div>')
                    .text(label)
                    .appendTo($items)
                    .addClass('toc--item')
                    .attr('tabIndex', '0')
                    .on('click keypress', function () {
                        $body.animate({
                            scrollTop: $this.offset().top - 30
                        }, 700, 'swing');
                    });
            });
        }
    };
});
