angular.module('tcp').directive('event', [
    'RUNTIME',
    'DOMAIN',
    '$q',
    'lodash',
    'utils',
    'Services',
    'SessionService',
    function (RUNTIME, DOMAIN, $q, lodash, utils, Services, SessionService) {
        'use strict';

        var HTML_VIEW = [
            '<div class="event-elem--view">',
            '    <div ng-if="ev.id" class="margin-bottom-small">',
            '        <i18n class="event-elem__date" date="{{::ev.date}}"',
            '            format="D MMM, YYYY"></i18n>',
            '        <span class="font-size-small margin-left-small imgview imgview--with-content imgview--sources">{{::ev.sources.length | number}}</span>',
            '    </div>',
            '    <h2>{{::ev.title}}</h2>',
            '    <div ng-repeat="source in ev.$sources" class="line-separated">',
            '        <a target="_blank" rel="noreferrer" href="{{::source.url}}">{{::source.url}}</a>',
            '        <h4 i18n date="{{::source.published_date}}" format="D MMM, YYYY" class="margin-top-xsmall"></h4>',
            '        <p>{{::source.summary}}</p>',
            '    </div>',
            '</div>',
        ].join('');

        var HTML_EDIT = [
            '<form class="event-elem form--listed">',
            '    <h2 i18n="event/add"></h2>',

            '    <section popover-body>',
            '        <section>',
            '           <label for="source_1_url" i18n="event/source_url_primary"></label>',
            '           <input id="source_1_url" type="text" ng-model="ev.$sources[0].url" ',
            '               ng-model-options="{ debounce: { default: 100 } }"',
            '               ng-class="{ loading: ev.$sources[0].$loading }" />',
            '        </section>',

            '        <section>',
            '            <label i18n="event/sentiment"></label>',
            '            <label class="label--inline margin-right-small">',
            '                <input type="radio" name="sentiment" value="positive" ng-model="ev.sentiment" />',
            '                <span i18n="event/sentiment_positive"></span>',
            '            </label>',
            '            <label class="label--inline margin-right-small">',
            '                <input type="radio" name="sentiment" value="negative" ng-model="ev.sentiment" />',
            '                <span i18n="event/sentiment_negative"></span>',
            '            </label>',
            '            <label class="label--inline">',
            '                <input type="radio" name="sentiment" value="neutral" ng-model="ev.sentiment" />',
            '                <span i18n="event/sentiment_neutral"></span>',
            '            </label>',
            '        </section>',

            '        <section class="event-elem__logo">',
            '            <label i18n="event/logo"></label>',
            '            <table>',
            '                <tr>',
            '                    <td>',
            '                        <label class="label--inline">',
            '                            <input type="radio" name="logo" value="hammer" ng-model="ev.logo" />',
            '                            <div class="event-elem__logo--hammer"></div>',
            '                            <span i18n="event/logo_human_rights"></span>',
            '                        </label>',
            '                    </td>',
            '                    <td>',
            '                        <label class="label--inline">',
            '                            <input type="radio" name="logo" value="world" ng-model="ev.logo" />',
            '                            <div class="event-elem__logo--world"></div>',
            '                            <span i18n="event/logo_environmental"></span>',
            '                        </label>',
            '                    </td>',
            '                    <td>',
            '                        <label class="label--inline">',
            '                            <input type="radio" name="logo" value="animal" ng-model="ev.logo" />',
            '                            <div class="event-elem__logo--animal"></div>',
            '                            <span i18n="event/logo_animal_rights"></span>',
            '                        </label>',
            '                    </td>',
            '                </tr>',
            '            </table>',
            '        </section>',

            '        <section>',
            '            <label for="event_title" i18n="event/title"></label>',
            '            <input id="event_title" type="text" ng-model="ev.title" />',

            '            <label for="event_date" i18n="event/date"></label>',
            '            <input id="event_date" type="date" ng-date-picker ng-model="ev.$date" />',

            '            <label i18n="event/tied_to"></label>',
            '            <pills',
            '                selections="ev.$companies"',
            '                create="vm.create_company(value, done)"',
            '                query="vm.query_companies(query, done)"',
            '            ></pills>',

            '            <label i18n="event/tags"></label>',
            '            <pills',
            '                selections="ev.$tags"',
            '                create="vm.create_tag(value, done)"',
            '                query="vm.query_tags(query, done)"',
            '            ></pills>',
            '        </section>',

            '        <section>',
            '            <div ng-repeat="source in ev.$sources">',
            '                <div collapsable>',
            '                    <h3 collapsable-trigger i18n="event/source_number" data="{number: {{$index + 1}}}"></h3>',

            '                    <div collapsable-area>',
            '                        <label for="event_source_{{$index}}_source" i18n="event/source_url"></label>',
            '                        <input id="event_source_{{$index}}_source" type="text" ng-model="source.url" ',
            '                            ng-model-options="{ debounce: { default: 100 } }"',
            '                            ng-class="{ loading: source.$loading }" />',
            '                        <label for="event_source_{{$index}}_title" i18n="event/source_title"></label>',
            '                        <input id="event_source_{{$index}}_title" type="text" ng-model="source.title" />',
            '                        <label for="event_source_{{$index}}_date" i18n="event/pub_date"></label>',
            '                        <input id="event_source_{{$index}}_date" type="date" ng-date-picker ng-model="source.$published_date" />',
            '                        <label for="event_source_{{$index}}_quote" i18n="event/quote" data="{limit: 500}"></label>',
            '                        <textarea id="event_source_{{$index}}_quote" ng-model="source.summary"></textarea>',
            '                    </div>',
            '                </div>',
            '            </div>',
            '        </section>',
            '    </section>',

            '    <button class="right margin-top-small" ng-click="vm.save()"',
            '        i18n="admin/save"></button>',
            '    <button class="right margin-top-small button--link" ng-click="cancelTriggered()"',
            '        i18n="admin/cancel"></button>',
            '    <button class="right margin-top-small button--link" ng-click="vm.add_source()"',
            '        i18n="event/add_source"></button>',
            '</form>',
        ].join('');

        /**
         * @param {jQuery} $elem
         */
        function scroll_to_bottom($elem) {
            setTimeout(function () {
                $elem.scrollTop(Number.MAX_VALUE);
                $elem.find('[popover-body]').scrollTop(Number.MAX_VALUE);
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
                    .filter(has_new_url)
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
            source.$loaded_url = source.url;
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
        function has_new_url(source) {
            return source.url !== source.$loaded_url;
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
            return Services.extract.page(source.url).then(function (content) {
                source.$loading = false;
                content.data.body.$source = source;
                return content.data.body;
            });
        }

        /**
         * @param {Object} tag
         * @return {Object}
         */
        function normalize_tag(tag) {
            return {
                type: 'tag-approved-' + tag.approved.toString(),
                label: tag[RUNTIME.locale],
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
            ev.$companies = tied_to && tied_to.companies ?
                lodash.map(tied_to.companies, normalize_company) : [];
        }

        /**
         * @param {Event} ev
         * @return {Event}
         */
        function get_normalized_event(ev) {
            return {
                id: ev.id || Services.query.UUID,
                title: ev.title,
                date: new Date(ev.$date).valueOf(),
                sentiment: ev.sentiment,
                logo: ev.logo,
                created_by: ev.created_by || SessionService.USER.id,
                updated_by: SessionService.USER.id,
            };
        }

        /**
         * @param {Company} company
         * @param {Event} ev
         * @return {MessagePayload}
         */
        function get_normalized_missing_information_company_notification(company, ev) {
            return {
                obj_id: company.id,
                obj_name: company.name,
                obj_type: DOMAIN.model.company,
                obj_for_type: DOMAIN.model.event,
                obj_for_id: ev.id,
                obj_for_name: ev.title,
                obj_fields: [
                    DOMAIN.model.company_props.summary,
                    DOMAIN.model.company_props.wikipedia_url,
                    DOMAIN.model.company_props.website_url,
                ],
            };
        }

        /**
         * @param {EventSource} source
         * @param {String} event_id
         * @return {EventSource}
         */
        function get_normalized_event_source(source, event_id) {
            return {
                id: source.id || Services.query.UUID,
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
            var has_missing_information = [];

            $scope.vm = $scope.vm || {};
            $scope.ev = {
                id: null,
                sentiment: null,
                logo: null,
                title: null,
                created_by: null,
                date: null,
                $date: null,
                $sources: [{}],
                $companies: [],
                $tags: []
            };

            $scope.api = $scope.api || {};
            $scope.api.reset = function () {
                lodash.each($scope.ev, function (val, key) {
                    delete $scope.ev[key];
                });

                $scope.ev.$sources = [{}];
                $scope.ev.$companies = [];
                $scope.ev.$tags = [];

                fecth_companies_tied_to($scope.ev, $scope.tiedTo);
            };

            $scope.$watch('ev.$sources', fetch_sources.bind(null, $scope.ev), true);
            $scope.$watch('tiedTo', fecth_companies_tied_to.bind(null, $scope.ev));

            $scope.vm.save = function () {
                var method = $scope.ev.id ? 'upsert' : 'create';

                // XXX should be one request
                Services.query.events[method](get_normalized_event($scope.ev)).then(function (ev) {
                    if (!ev.id) {
                        ev = $scope.ev;
                    }

                    $q.all([].concat(
                        lodash.map($scope.ev.$sources, function (source) {
                            return Services.query.events.sources.upsert(ev.id,
                                get_normalized_event_source(source, ev.id));
                        }),
                        lodash.map($scope.ev.$tags, function (tag) {
                            return Services.query.events.tags.upsert(ev.id,
                                get_normalized_event_tag(tag, ev.id));
                        }),
                        lodash.map($scope.ev.$companies, function (company) {
                            return Services.query.companies.events.upsert(company.id,
                                get_normalized_company_event(company, ev.id));
                        }),
                        lodash.map(has_missing_information, function (company) {
                            return Services.notification.missing_information(
                                get_normalized_missing_information_company_notification(company, ev));
                        })
                    )).then(function (res) {
                        SessionService.emit(SessionService.EVENT.NOTIFY);
                        $scope.onSave({ ev: ev, children: res });
                    });
                });
            };

            $scope.vm.query_companies = function (str, done) {
                Services.query.search.companies('name', str).then(function (companies) {
                    done(null, lodash.map(companies, normalize_company));
                }).catch(done);
            };

            $scope.vm.create_company = function (str, done) {
                utils.assert(str, done);
                utils.assert(SessionService.USER.id);

                Services.query.companies.create({
                    id: Services.query.UUID,
                    name: str,
                    guid: utils.simplify(str),
                    created_by: SessionService.USER.id,
                    updated_by: SessionService.USER.id
                }).then(function (company) {
                    has_missing_information.push(company);
                    done(null, normalize_company(company));
                }).catch(done);
            };

            $scope.vm.query_tags = function (str, done) {
                Services.query.search.tags(RUNTIME.locale, str).then(function (tags) {
                    done(null, lodash.map(tags, normalize_tag));
                }).catch(done);
            };

            $scope.vm.create_tag = function (str, done) {
                utils.assert(str, done);
                utils.assert(SessionService.USER.id);

                var tag = {
                    id: Services.query.UUID,
                    created_by: SessionService.USER.id,
                    updated_by: SessionService.USER.id
                };

                tag[RUNTIME.locale] = str;

                Services.query.tags.create(tag).then(function (tag) {
                    done(null, normalize_tag(tag));
                }).catch(done);
            };

            /**
             * @param {String} id
             * @return {void}
             */
            function load(id) {
                Services.query.events.retrieve(id, ['sources', 'tags', 'companies'], ['tags', 'companies']).then(function (ev) {
                    $scope.ev = ev;
                    $scope.ev.$date = new Date(ev.date);
                    $scope.ev.$tags = lodash.map(ev.tags, normalize_tag);
                    $scope.ev.$companies = lodash.map(ev.companies, normalize_company);
                    $scope.ev.$sources = lodash.map(ev.sources, function (source) {
                        // so sources are not fetched on the initial load
                        source.$loaded_url = source.url;
                        source.$published_date = new Date(source.published_date);
                        return source;
                    });
                });
            }

            if ($scope.id) {
                load($scope.id);
            }
        }

        function link($scope, $elem, $attrs) {
            $scope.vm = $scope.vm || {};
            $scope.vm.add_source = function () {
                $scope.ev.$sources.push({});
                scroll_to_bottom($elem.closest('div'));
            };

            $scope.cancelTriggered = function () {
                $elem.find('.pills-container input').val('');
                $scope.onCancel();
            };

            // XXX see "event view in timeline animation start" in events css
            // styles allow event views to have a "slide up" effect this allows
            // that same event view to be fully displayed without overwriting
            // the "slide up" logic
            // if ($attrs.type === 'view') {
            //     $elem.css('max-height', 'none');
            // }
        }

        function template(elem, attrs) {
            return attrs.type === 'view' ? HTML_VIEW : HTML_EDIT;
        }

        return {
            replace: true,
            controller: ['$scope', controller],
            template: template,
            link: link,
            scope: {
                id: '@',
                api: '=',
                tiedTo: '=',
                onCancel: '&',
                onSave: '&'
            },
        };
    }
]);
