angular.module('tcp').controller('guideController', [
    '$scope',
    function ($scope) {
        $scope.counter = 42;
        $scope.tags = [];

        $scope.addTag = function () {
            $scope.tags.push({
                counter: parseInt(Math.random() * 100),
                label: 'Tag #' + ($scope.tags.length + 1),
                type: Math.random() > .5 ? 'good' : 'bad'
            });
        };

        $scope.incrementCounter = function () {
            $scope.counter++;
        };

        for (var i = 0; i < 2; i++)
            $scope.addTag();
    }
]);

angular.module('tcp').directive('toc', function () {
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
                    .on('click', function () {
                        $body.animate({
                            scrollTop: $this.offset().top - 30
                        }, 700, 'swing');
                    });
            });
        }
    };
});
