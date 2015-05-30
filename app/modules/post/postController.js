angular.module('tcp').controller('postController', ['$scope', '$window', 'postService', 'extract', 'rangy', 'lodash', function ($scope, $window, postService, extract, rangy, _) {
    var highlighter, selection;

    $scope.loading = false;
    $scope.editing = true;

    $scope.selection = null;
    $scope.showSelectionEditor = false;

    /**
     * generate a highlights storage key
     * @return {String}
     */
    function key() {
        return 'hi-' + $scope.url;
    }

    $scope.initialize = function () {
        rangy.init();

        highlighter = rangy.createHighlighter();
        highlighter.addClassApplier(rangy.createClassApplier('highlight', {
            ignoreWhiteSpace: true,
            tagNames: ['span']
        }));
    };

    $scope.saveSelection = function () {
        selection = null;
        localStorage.setItem(key(), highlighter.serialize());
    };

    /**
     * removes the last selection object is it is set. selection object we
     * want to keep must be serialized and unset from this var
     */
    $scope.selectionStarting = function () {
        $window.getSelection().removeAllRanges();
        highlighter.removeHighlights([selection])
    };

    $scope.selectionMade = function () {
        selection = highlighter.highlightSelection('highlight');
        selection = selection[selection.length - 1];

        $window.getSelection().removeAllRanges();
        $scope.selection = selection;
        $scope.showSelectionEditor = true;
    };

    $scope.fetchArticle = function () {
        var highlights = localStorage.getItem(key());

        if (!$scope.url) {
            return;
        }

        $scope.loading = true;;
        $scope.article = null;

        extract.fetch($scope.url).then(function (article) {
            if (!article.ok) {
                alert('Error loading article');
            }

            $scope.article = article;
            $scope.loading = false;
            $scope.$apply();

            if (highlights) {
                // $evalAsync makes it so the highlights appear right as the
                // article appears
                $scope.$evalAsync(function () {
                    highlighter.deserialize(highlights);
                });
            }
        });
    };

    $scope.edit = function () {
        $scope.editing = true;
    };

    $scope.save = function () {
        $scope.editing = false;
    };

    // XXX - remove once done testing
    $scope.company = 'Hormel';
    $scope.url = 'http://www.nytimes.com/2015/05/28/world/asia/chinas-high-hopes-for-growing-those-rubber-tree-plants.html';
    $scope.fetchArticle();
}]);
