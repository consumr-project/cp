angular.module('tcp').directive('companyEvent', [
    'lodash',
    'extract',
    'tag',
    'Cache',
    function (_, extract, tag, Cache) {
        'use strict';

        var tags_cache = new Cache();

        /**
         * @param {extract.ApiResponsePayload}
         */
        function normalizeContent(content) {
            content.keywords = content.keywords || [];
            content.entities = content.entities || [];
        }

        /**
         * @param {String} url
         * @param {extract.ApiResponsePayload} content
         * @return {String[]}
         */
        function cacheTags(url, content) {
            var list = content.entities.concat(content.keywords),
                tags = tag.normalize(list, 'name');

            tags_cache.set(url, tags);
            return tags;
        }

        /**
         * @param {String} source
         * @return {Boolean}
         */
        function uncachedTag(source) {
            return !tags_cache.has(source);
        }

        /**
         * @param {String} source
         * @return {String}
         */
        function getTag(source) {
            return source in tags_cache.memory ?
                tags_cache.memory[source].val : undefine;
        }

        /**
         * @param {Object} ref
         */
        function populateEventTags(ref) {
            ref.keywords = tag.normalize(_.chain(ref.sources)
                .filter()
                .filter(tags_cache.has.bind(tags_cache))
                .map(getTag)
                .flatten()
                .value()
            );
        }

        /**
         * @param {Object} ref
         * @param {extract.ApiResponsePayload} content
         */
        function populateEvent(ref, content) {
            ref.title = content.title;
            ref.description = content.description;
            ref.date = content.published;
            ref.$date = new Date(content.published);
        }

        /**
         * @param {Object} ref
         */
        function clearEvent(ref) {
            delete ref.title;
            delete ref.description;
            delete ref.date;
            delete ref.$date;
        }

        function controller($scope) {
            var orig_source;

            $scope.vm = {};
            $scope._ = { range: _.range };

            $scope.ev = {
                title: '',
                sources: [],
            };

            // XXX
            setTimeout(function () {
            $scope.ev.sources.push('http://www.bbc.com/news/world-europe-34742273');
            $scope.ev.sources.push('http://www.bbc.com/news/world-australia-34762988');
            $scope.ev.sources.push('http://www.bbc.com/news/world-europe-34759570');
            $scope.$apply();
            }, 500);

            $scope.$watchCollection('ev.sources', function (sources) {
                var source;

                if (!sources.length) {
                    return;
                }

                source = _.head(sources);
                $scope.ev.sources = _.filter($scope.ev.sources);
                populateEventTags($scope.ev);

                if (orig_source !== source) {
                    orig_source = source;

                    $scope.vm.fetchingArticle = true;
                    clearEvent($scope.ev);

                    extract.fetch(source).then(function (content) {
                        $scope.vm.fetchingArticle = false;
                        normalizeContent(content);
                        cacheTags(source, content);
                        populateEvent($scope.ev, content);
                        populateEventTags($scope.ev);
                        $scope.$apply();
                    });
                }

                _.chain(sources).tail().filter().filter(uncachedTag).each(function (source) {
                    extract.fetch(source).then(function (content) {
                        normalizeContent(content);
                        cacheTags(source, content);
                        populateEventTags($scope.ev);
                        $scope.$apply();
                    });
                }).value();
            });
        }

        return {
            replace: true,
            templateUrl: '/app/elements/company-event/company-event.html',
            scope: { onCancel: '&' },
            controller: ['$scope', controller]
        };
    }
]);
