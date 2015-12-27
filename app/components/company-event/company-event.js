angular.module('tcp').directive('companyEvent', [
    '$q',
    '$http',
    'lodash',
    'ServicesService',
    'SessionService',
    function ($q, $http, lodash, ServicesService, SessionService) {
        'use strict';

        /**
         * @param {jQuery} $elem
         */
        function scroll_to_bottom($elem) {
            setTimeout(function () {
                $elem.scrollTop(Number.MAX_VALUE);
            }, 10);
        }

        /**
         * @param {Event} ev
         * @param {Source[]} update
         * @param {Source[]} prev
         */
        function fetch_sources(ev, update, prev) {
            $q.all(
                lodash(update)
                    .difference(prev)
                    .filter(can_load_content)
                    .map(fetch_content)
                    .value()
            ).then(function (contents) {
                lodash.each(contents, populate_source_from_content);
                populate_event(ev, contents[0]);
            });
        }

        /**
         * @param {Event} ev
         * @param {extract.PageExtract} [content]
         * @param {Boolean} [overwrite] (default: false)
         */
        function populate_event(ev, content, overwrite) {
            function get(ev_field, content_field) {
                var orig_val = ev[ev_field];
                return orig_val && !overwrite ? orig_val :
                    content[content_field || ev_field];
            }

            content = content || {};

            ev.title = get('title');
            ev.date = get('date', 'published');
            ev.$date = new Date(get('date', 'published'));
        }

        /**
         * @param {Source} source
         * @param {extract.PageExtract} content
         * @return {Source}
         */
        function populate_source(source, content) {
            source.title = content.title;
            source.published_date = content.published;
            source.$published_date = new Date(content.published);
        }

        /**
         * @param {Source} source
         * @return {Source}
         */
        function populate_source_from_content(content) {
            return populate_source(content.$source, content);
        }

        /**
         * @param {Source} source
         * @return {Boolean}
         */
        function can_load_content(source) {
            return !!source.url;
        }

        /**
         * @param {Source} source
         * @return {Promise<extract.PageExtract>}
         */
        function fetch_content(source) {
            source.$loading = true;
            return extract_page(source.url).then(function (content) {
                source.$loading = false;
                content.data.$source = source;
                return content.data;
            });
        }

        /**
         * @param {String} url
         * @return {Promise}
         */
        function extract_page(url) {
            return $http.get('/service/extract/page?url=' + encodeURIComponent(url));
        }

        /**
         * @param {Object} tag
         * @return {Object}
         */
        function normalize_tag(tag) {
            return {
                label: tag['en-US'],
                id: tag.id
            };
        }

        /**
         * @param {Company} company
         * @return {Object}
         */
        function normalize_company(company) {
            return {
                label: company.name,
                id: company.id
            };
        }

        /**
         * @param {Event} ev
         * @param {Object} tied_to
         * @return {Promise}
         */
        function fecth_companies_tied_to(ev, tied_to) {
            ev.$companies = lodash.map(tied_to.companies, normalize_company);
        }

        /**
         * @param {Event} ev
         * @return {Event}
         */
        function get_normalized_event(ev) {
            return {
                id: ev.id || ServicesService.query.UUID,
                title: ev.title,
                sentiment: ev.sentiment,
                created_by: ev.created_by || SessionService.USER.id,
                updated_by: SessionService.USER.id,
            };
        }

        /**
         * @param {EventSource} source
         * @param {String} event_id
         * @return {EventSource}
         */
        function get_normalized_event_source(source, event_id) {
            return {
                id: source.id || ServicesService.query.UUID,
                title: source.title,
                url: source.url,
                published_date: new Date(source.$published_date).valueOf(),
                summary: source.summary,
                created_by: source.created_by || SessionService.USER.id,
                updated_by: SessionService.USER.id
            };
        }

        /**
         * @param {EventTag} tag
         * @return {EventTag}
         */
        function get_normalized_event_tag(tag, event_id) {
            return {
                event_id: event_id,
                tag_id: tag.tag_id || tag.id
            };
        }

        /**
         * @param {CompanyEvent} company
         * @param {String} event_id
         * @return {CompanyEvent}
         */
        function get_normalized_company_event(company, event_id) {
            return {
                event_id: event_id,
                company_id: company.company_id || company.id
            };
        }

        function controller($scope) {
            $scope.vm = $scope.vm || {};
            $scope.ev = {
                $sources: [{}],
                $companies: [],
                $tags: []
            };

            $scope.$watch('ev.$sources', fetch_sources.bind(null, $scope.ev), true);
            $scope.$watch('tiedTo', fecth_companies_tied_to.bind(null, $scope.ev));

            $scope.vm.save = function () {
                ServicesService.query.events.create(get_normalized_event($scope.ev)).then(function (ev) {
                    $q.all([].concat(
                        lodash.map($scope.ev.$sources, function (source) {
                            return ServicesService.query.events.sources.upsert(ev.id, get_normalized_event_source(source, ev.id));
                        }),
                        lodash.map($scope.ev.$tags, function (tag) {
                            return ServicesService.query.events.tags.upsert(ev.id, get_normalized_event_tag(tag, ev.id));
                        }),
                        lodash.map($scope.ev.$companies, function (company) {
                            return ServicesService.query.companies.events.upsert(company.id, get_normalized_company_event(company, ev.id));
                        })
                    )).then(function (res) {
                        console.log(ev, res);
                        $scope.onSave({
                            ev: ev,
                            children: res
                        });
                    });
                });
            };

            $scope.vm.query_companies = function (str, done) {
                ServicesService.query.search.companies('name', str).then(function (companies) {
                    done(null, lodash.map(companies, normalize_company));
                }).catch(done);
            };

            $scope.vm.query_tags = function (str, done) {
                ServicesService.query.search.tags('en-US', str).then(function (tags) {
                    done(null, lodash.map(tags, normalize_tag));
                }).catch(done);
            };
        }

        function link($scope, $elem) {
            $scope.vm = $scope.vm || {};
            $scope.vm.add_source = function () {
                $scope.ev.$sources.push({});
                scroll_to_bottom($elem.closest('div'));
            };
        }

        return {
            replace: true,
            controller: ['$scope', controller],
            link: link,
            scope: {
                tiedTo: '=',
                onCancel: '&',
                onSave: '&'
            },
            template: [
                '<form class="company__event form--listed">',
                '    <h2 i18n="company/add_event"></h2>',

                '    <section>',
                '        <label i18n="company/field_sentiment"></label>',
                '        <label>',
                '            <input type="radio" name="sentiment" value="positive" ng-model="ev.sentiment" />',
                '            <span i18n="company/field_sentiment_positive"></span>',
                '        </label>',
                '        <label>',
                '            <input type="radio" name="sentiment" value="negative" ng-model="ev.sentiment" />',
                '            <span i18n="company/field_sentiment_negative"></span>',
                '        </label>',
                '        <label>',
                '            <input type="radio" name="sentiment" value="neutral" ng-model="ev.sentiment" />',
                '            <span i18n="company/field_sentiment_neutral"></span>',
                '        </label>',
                '    </section>',

                '    <section>',
                '        <label i18n="company/field_title"></label>',
                '        <input type="text" ng-model="ev.title" />',

                '        <label i18n="company/field_date"></label>',
                '        <input type="date" ng-model="ev.$date" />',

                '        <label i18n="company/field_tied_to"></label>',
                '        <pills selections="ev.$companies" query="vm.query_companies(query, done)"></pills>',

                '        <label i18n="company/field_tags"></label>',
                '        <pills selections="ev.$tags" query="vm.query_tags(query, done)"></pills>',
                '    </section>',

                '    <section>',
                '        <div ng-repeat="source in ev.$sources">',
                '            <h3 i18n="company/source_title" data="{number: {{$index + 1}}}"></h3>',

                '            <label i18n="company/field_source"></label>',
                '            <input type="text" ng-model="source.url" ng-class="{ loading: source.$loading }" />',
                '            <label i18n="company/field_title"></label>',
                '            <input type="text" ng-model="source.title" />',
                '            <label i18n="company/field_pub_date"></label>',
                '            <input type="date" ng-model="source.$published_date" />',
                '            <textarea i18n="company/field_quote" data="{limit: 500}"',
                '                ng-model="source.summary" prop="placeholder"',
                '                class="margin-top-small"></textarea>',
                '        </div>',
                '    </section>',

                '    <button class="right margin-top-small" ng-click="vm.save()" i18n="admin/save"></button>',
                '    <button class="right margin-top-small button--link" ng-click="onCancel()"',
                '        i18n="admin/cancel"></button>',

                '    <button class="right margin-top-small button--link" ng-click="vm.add_source()"',
                '        i18n="company/add_source"></button>',
                '</form>'
            ].join('')
        };
    }
]);
