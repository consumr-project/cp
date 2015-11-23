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

        function controller($scope) {
            var prev_sources;

            $scope.vm = {};

            $scope.ev = {
                title: '',
                sources: [],
            };

            $scope.$watch('ev.sources', fetchSources, true);

// XXX // $scope._ = { range: _.range };
window.ev=$scope.ev;
setTimeout(function () {
$scope.ev.sources.push({url: 'http://www.bbc.com/news/world-europe-34742273'});
// $scope.ev.sources.push({url: 'http://www.bbc.com/news/world-australia-34762988'});
// $scope.ev.sources.push({url: 'http://www.bbc.com/news/world-europe-34759570'});
$scope.$apply();
}, 500);

            $scope.save = function () {
                // events.put($scope.ev, ['date', 'description', 'keywords', 'sources', 'title'])
                //     .then(function () { $scope.onSave(); })
                //     .catch(function () { console.error('error saving', $scope.ev); });
            };

            $scope.queryTags = function (str, done) {
                /**
                 * @param {Object} tag
                 * @param {String} id
                 * @return {Object}
                 */
                function normalize(tag, id) {
                    return {
                        label: tag['en-US'],
                        id: id
                    };
                }

                /**
                 * @param {Object} tag
                 * @return {Boolean}
                 */
                function matches(tag) {
                    return tag.label.toLowerCase().indexOf(str.toLowerCase()) !== -1;
                }

                done(null, _.chain(tags.all)
                    .map(normalize)
                    .filter(matches)
                    .value());
            };

            /**
             * @param {String} url
             * @return {Promise}
             */
            function extractPage(url) {
                return $http.get('/service/extract/page?url=' + encodeURIComponent(url));
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
             * @param {Source[]} update
             * @param {Source[]} prev
             */
            function fetchSources(update, prev) {
                $q.all(
                    _(update)
                        .difference(prev)
                        .map(fetchContent)
                        .value()
                ).then(function (contents) {
                    _.each(contents, populateSourceFromContent);
                    populateEvent($scope.ev, contents[0]);
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

            if (!tags.all) {
                tags.store.once('value', function (res) {
                    tags.all = res.val();
                });
            }
        }

        return {
            replace: true,
            templateUrl: '/app/components/company-event/company-event.html',
            controller: ['$scope', controller],
            scope: {
                tiedTo: '=',
                onCancel: '&',
                onSave: '&'
            }
        };
    }
]);
