angular.module('tcp').directive('companyEvent', [
    '$q',
    '$http',
    'lodash',
    'utils',
    'keyword',
    'tags',
    // 'events',
    // 'companyEvents',
    function ($q, $http, _, utils, keyword, tags, events, companyEvents) {
        'use strict';

        /**
         * @param {jQuery} $elem
         */
        function scrollToBottom($elem) {
            setTimeout(function () {
                $elem.scrollTop(Number.MAX_VALUE);
            }, 10);
        }

        /**
         * @param {Event} ev
         * @param {Source[]} update
         * @param {Source[]} prev
         */
        function fetchSources(ev, update, prev) {
            $q.all(
                _(update)
                    .difference(prev)
                    .filter(canLoadContent)
                    .map(fetchContent)
                    .value()
            ).then(function (contents) {
                _.each(contents, populateSourceFromContent);
                populateEvent(ev, contents[0]);
            });
        }

        /**
         * @param {Event} ev
         * @param {extract.PageExtract} [content]
         * @param {Boolean} [overwrite] (default: false)
         */
        function populateEvent(ev, content, overwrite) {
            function get(ev_field, content_field) {
                var orig_val = ev[ev_field];
                return orig_val && !overwrite ? orig_val :
                    content[content_field || ev_field];
            }

            content = utils.def(content, {});

            ev.title = get('title');
            ev.date = get('date', 'published');
            ev.$date = new Date(get('date', 'published'));
        }

        /**
         * @param {Source} source
         * @param {extract.PageExtract} content
         * @return {Source}
         */
        function populateSource(source, content) {
            source.title = content.title;
            source.date = content.published;
            source.$date = new Date(content.published);
        }

        /**
         * @param {Source} source
         * @return {Source}
         */
        function populateSourceFromContent(content) {
            return populateSource(content.$source, content);
        }

        /**
         * @param {Source} source
         * @return {Boolean}
         */
        function canLoadContent(source) {
            return !!source.url;
        }

        /**
         * @param {Source} source
         * @return {Promise<extract.PageExtract>}
         */
        function fetchContent(source) {
            source.$loading = true;
            return extractPage(source.url).then(function (content) {
                source.$loading = false;
                content.data.$source = source;
                return content.data;
            });
        }

        /**
         * @param {String} url
         * @return {Promise}
         */
        function extractPage(url) {
            return $http.get('/service/extract/page?url=' + encodeURIComponent(url));
        }

        /**
         * @param {Object} tag
         * @param {String} id
         * @return {Object}
         */
        function normalizeTag(tag, id) {
            return {
                label: tag['en-US'],
                id: id
            };
        }

        /**
         * @param {String} str
         * @param {Object} tag
         * @return {Boolean}
         */
        function tagMatchesQuery(str, tag) {
            return tag.label.toLowerCase().indexOf(str.toLowerCase()) !== -1;
        }

        function controller($scope) {
            $scope.vm = $scope.vm || {};
            $scope.ev = { title: '', sources: [] };
            $scope.$watch('ev.sources', fetchSources.bind(null, $scope.ev), true);

            $scope.vm.save = function () {
                // events.put($scope.ev, ['date', 'description', 'keywords', 'sources', 'title'])
                //     .then(function () { $scope.onSave(); })
                //     .catch(function () { console.error('error saving', $scope.ev); });
            };

            $scope.vm.queryTags = function (str, done) {
                done(null, _.chain(tags.all)
                    .map(normalizeTag)
                    .filter(tagMatchesQuery.bind(null, str))
                    .value());
            };

            if (!tags.all) {
                tags.store.once('value', function (res) {
                    tags.all = res.val();
                });
            }
        }

        function link($scope, $elem) {
            $scope.vm = $scope.vm || {};
            $scope.vm.addSource = function () {
                $scope.ev.sources.push({});
                scrollToBottom($elem.closest('div'));
            };
        }

        return {
            replace: true,
            templateUrl: '/app/components/company-event/company-event.html',
            controller: ['$scope', controller],
            link: link,
            scope: {
                tiedTo: '=',
                onCancel: '&',
                onSave: '&'
            }
        };
    }
]);
