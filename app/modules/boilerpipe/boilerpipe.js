'use strict';

angular.module('boilerpipe', []).service('boilerpipe', ['$http', function ($http) {
    /**
     * @param {String} url
     * @return {Promise<Object>}
     */
    function fetch() {
        // http://boilerpipe-web.appspot.com/extract?url=http%3A%2F%2Fwww.nytimes.com%2F2015%2F05%2F28%2Fworld%2Fasia%2Fchinas-high-hopes-for-growing-those-rubber-tree-plants.html%3Faction%3Dclick%26pgtype%3DHomepage%26module%3Dphoto-spot-region%26region%3Dtop-news%26WT.nav%3Dtop-news%26hp&extractor=ArticleExtractor&output=json&extractImages=3
        // return $http.jsonp();
    }

    return {
        fetch: fetch
    };
}]);
