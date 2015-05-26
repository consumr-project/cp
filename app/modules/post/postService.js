angular.module('tcp').service('postService', ['postStore', function (postStore) {
    return {
        add: function (postInformation) {
            return postStore.push(postInformation);
        }
    };
}]);