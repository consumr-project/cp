angular.module('tcp').directive('event', [
    'RUNTIME',
    'EVENTS',
    'DOMAIN',
    '$q',
    '$window',
    'lodash',
    'utils',
    'Services',
    'Session',
    'shasum',
    'i18n',
    'validator',
    'slug',
    function (RUNTIME, EVENTS, DOMAIN, $q, $window, lodash, utils, Services, Session, shasum, i18n, validator, slug) {
        'use strict';

        var head = lodash.head,
            map = lodash.map,
            uniq = lodash.uniqBy;

        var HTML_VIEW = [
            '<div class="event-elem--view" ng-class="{loading: vm.loading}">',
                '<div class="loading__only center-align" ',
                    'i18n="common/loading_event"></div>',
                '<div ng-if="ev.id" class="animated fadeIn">',
                    '<div class="margin-bottom-small">',
                        '<i18n class="event-elem__date" date="{{::ev.date}}" ',
                            'format="D MMM, YYYY"></i18n>',
                        '<span class="font-size-small margin-left-small imgview imgview--with-content imgview--sources">{{::ev.sources.length | number}}</span>',
                        '<span class="font-size-small margin-left-xsmall imgview imgview--with-content imgview--bookmarks">{{::ev.bookmarks["@meta"].instead.count | number}}</span>',
                    '</div>',
                    '<h2>{{::ev.title}}</h2>',
                    '<source ng-repeat="source in ev.$sources" model="source"></source>',
                '</div>',
            '</div>',
        ].join('');

        var HTML_SMALL = [
            '<div class="event-elem--small">',
                '<div class="event-elem__logo__icon event-elem__logo__icon--{{::model.logo}}"></div>',
                '<div class="event-elem__container">',
                    '<i18n class="event-elem__date" date="{{::model.date}}" ',
                        'format="D MMM, YYYY"></i18n>',
                    '<h2 class="event-elem__title">{{::model.title}}</h2>',
                    '<p>{{::model.summary}}</p>',
                '</div>',
            '</div>',
        ].join('');

        var HTML_EDIT = [
            '<form class="event-elem form--listed">',
                '<h2 class="italic" i18n="event/add"></h2>',

                '<section popover-body>',
                    '<section>',
                        '<input type="text" ng-model="ev.$sources[0].url" ',
                            'prop="placeholder" i18n="event/source_url_primary" ',
                            'ng-model-options="{ debounce: { default: 100 } }" ',
                            'ng-class="{ loading: ev.$sources[0].$loading }" />',
                        '<div i18n="event/missing_url" ',
                            'ng-class="{invalid: vm.valid.checks.url === false}" ',
                            'class="invalid__msg margin-top-xsmall"></div>',
                    '</section>',

                    '<section class="event-elem__logo" ng-class="{\'event-elem__logo--selected\': ev.logo}">',
                        '<label i18n="event/logo"></label>',
                        '<div i18n="event/missing_topic" ',
                            'ng-class="{invalid: vm.valid.checks.topic === false}" ',
                            'class="invalid__msg"></div>',
                        '<div class="scroll-x">',
                            '<table>',
                                '<tr>',
                                    '<td>',
                                        '<label class="label--inline">',
                                            '<input type="radio" name="logo" value="hammer" ng-model="ev.logo" />',
                                            '<div class="event-elem__logo__icon event-elem__logo__icon--hammer"></div>',
                                            '<span i18n="event/logo_human_rights"></span>',
                                        '</label>',
                                    '</td>',
                                    '<td>',
                                        '<label class="label--inline">',
                                            '<input type="radio" name="logo" value="world" ng-model="ev.logo" />',
                                            '<div class="event-elem__logo__icon event-elem__logo__icon--world"></div>',
                                            '<span i18n="event/logo_environmental"></span>',
                                        '</label>',
                                    '</td>',
                                    '<td>',
                                        '<label class="label--inline">',
                                            '<input type="radio" name="logo" value="animal" ng-model="ev.logo" />',
                                            '<div class="event-elem__logo__icon event-elem__logo__icon--animal"></div>',
                                            '<span i18n="event/logo_animal_rights"></span>',
                                        '</label>',
                                    '</td>',
                                    '<td>',
                                        '<label class="label--inline">',
                                            '<input type="radio" name="logo" value="consumer_protection" ng-model="ev.logo" />',
                                            '<div class="event-elem__logo__icon event-elem__logo__icon--consumer_protection"></div>',
                                            '<span i18n="event/logo_consumer_protection"></span>',
                                        '</label>',
                                    '</td>',
                                    '<td>',
                                        '<label class="label--inline">',
                                            '<input type="radio" name="logo" value="general" ng-model="ev.logo" />',
                                            '<div class="event-elem__logo__icon event-elem__logo__icon--general"></div>',
                                            '<span i18n="event/logo_general"></span>',
                                        '</label>',
                                    '</td>',
                                '</tr>',
                            '</table>',
                        '</div>',
                    '</section>',

                    '<section>',
                        '<input prop="placeholder" i18n="event/title" type="text" ng-model="ev.title" />',

                        '<label i18n="event/date"></label>',
                        '<datepicker ng-model="ev.$date"></datepicker>',
                        '<div i18n="event/missing_date" ',
                            'ng-class="{invalid: vm.valid.checks.date === false}" ',
                            'class="invalid__msg margin-top-xsmall"></div>',

                        '<label i18n="event/tied_to"></label>',
                        '<pills ',
                            'selections="ev.$companies" ',
                            'create="vm.create_company(value, done)" ',
                            'query="vm.query_companies(query, done)" ',
                            '></pills>',

                        '<label i18n="event/tags"></label>',
                        '<pills ',
                            'selections="ev.$tags" ',
                            'create="vm.create_tag(value, done)" ',
                            'query="vm.query_tags(query, done)" ',
                            '></pills>',
                    '</section>',

                    '<section>',
                        '<div ng-repeat="source in ev.$sources">',
                            '<div collapsable>',
                                '<h3 collapsable-trigger i18n="event/source_number" data="{number: {{$index + 1}}}"></h3>',

                                '<div collapsable-area>',
                                    '<input type="text" ng-model="source.url" ',
                                        'prop="placeholder" i18n="event/source_url" ',
                                        'ng-model-options="{ debounce: { default: 100 } }" ',
                                        'ng-class="{ loading: source.$loading }" />',

                                    '<input prop="placeholder" i18n="event/source_title" ',
                                        'type="text" ng-model="source.title" />',

                                    '<label i18n="event/pub_date"></label>',
                                    '<datepicker ng-model="source.$published_date"></datepicker>',

                                    '<textarea prop="placeholder" i18n="event/quote" data="{limit: 500}" ',
                                        'ng-model="source.summary"></textarea>',
                                '</div>',
                            '</div>',
                        '</div>',
                    '</section>',
                '</section>',

                '<button class="margin-top-small" ng-click="vm.save()" ',
                    'i18n="admin/save"></button>',
                '<button class="margin-top-small button--link" ng-click="cancelTriggered()" ',
                    'i18n="admin/cancel"></button>',
                '<button class="margin-top-small button--link" ng-click="vm.add_source()" ',
                    'i18n="event/add_source"></button>',
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
         * @param {Error} [err]
         */
        function error_creating_event(err) {
            var message = lodash.get(err, 'data.meta.message');

            if (message) {
                $window.alert(i18n.get('admin/error_creating_event_msg', {
                    message: message
                }));
            } else {
                $window.alert(i18n.get('admin/error_creating_event'));
            }
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
                populate_event(ev, head(contents));
                populate_tags(ev, head(contents));
            });
        }

        /**
         * @param {Event} ev
         * @param {extract.PageExtract} [content]
         */
        function populate_tags(ev, content) {
            var query;

            if (!content || !content.keywords || !content.keywords.length) {
                return;
            }

            query = content.keywords.slice(0, 10).join(' ');
            Services.search.tags(query).then(function (res) {
                var suggested_tags = map(res.body.results, function (raw) {
                    var tag = normalize_tag(raw);
                    tag.suggestion = true;
                    return tag;
                });

                ev.$tags = uniq(ev.$tags.concat(suggested_tags), 'id');
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
            ev.$date = new Date(get('date', 'published') || Date.now());
        }

        /**
         * @param {Source} source
         * @param {extract.PageExtract} content
         * @return {Source}
         */
        function populate_source(source, content) {
            source.title = content.title;
            source.published_date = content.published;
            source.$loaded_url = source.url;
            source.$published_date = new Date(content.published || Date.now());
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
            var approved;

            if (tag.approved) {
                approved = true;
            } else if (tag.source && tag.source.approved) {
                approved = true;
            } else {
                approved = false;
            }

            return {
                type: 'tag-approved-' + approved.toString(),
                label: tag[RUNTIME.locale] || tag.name,
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
        function fecth_tags_tied_to(ev, tied_to) {
            ev.$tags = tied_to && tied_to.tags ?
                lodash.map(lodash.filter(tied_to.tags), normalize_tag) : [];
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
         * @return {String}
         */
        function sha_event(ev) {
            return shasum([
                lodash.pick(ev, ['id', 'date', 'logo', 'titie']),
                lodash.map(ev.tags, 'id'),
                lodash.map(ev.companies, 'id'),
            ]);
        }

        /**
         * @param {EventSource[]} sources
         * @return {String}
         */
        function sha_sources(sources) {
            return shasum(lodash.map(sources, 'id'));
        }

        /**
         * @param {Event} ev
         * @return {Event}
         */
        function get_normalized_event(ev) {
            return {
                id: ev.id,
                title: ev.title,
                date: new Date(ev.$date).valueOf(),
                logo: ev.logo,
            };
        }

        /**
         * @param {EventSource} source
         * @return {EventSource}
         */
        function get_normalized_event_source(source) {
            return {
                id: source.id,
                title: source.title,
                url: source.url,
                published_date: new Date(source.$published_date).valueOf(),
                summary: source.summary,
            };
        }

        /**
         * @param {Object} obj
         * @return {boolean}
         */
        function is_not_suggestion(obj) {
            return !!!obj.suggestion;
        }

        /**
         * @param {EventTag} tag
         * @return {EventTag}
         */
        function get_normalized_event_tag(tag) {
            return {
                id: tag.tag_id || tag.id,
            };
        }

        /**
         * @param {CompanyEvent} company
         * @return {CompanyEvent}
         */
        function get_normalized_company_event(company) {
            return {
                id: company.company_id || company.id,
            };
        }

        function controller($scope) {
            var new_companies_created = [];

            $scope.vm = $scope.vm || {};
            $scope.vm.loading = false;

            $scope.ev = {
                id: null,
                logo: null,
                title: null,
                created_by: null,
                date: null,
                $date: null,
                $sources: [{}],
                $companies: [],
                $tags: []
            };

            $scope.vm.valid = validator({
                url: function () {
                    return !!$scope.ev.$sources &&
                        !!$scope.ev.$sources[0] &&
                        !!$scope.ev.$sources[0].url;
                },

                topic: function () {
                    return !!$scope.ev.logo;
                },

                date: function () {
                    return !!$scope.ev.$date &&
                        !!$scope.ev.$date.valueOf();
                },
            });

            $scope.api = $scope.api || {};
            $scope.api.reset = function () {
                lodash.each($scope.ev, function (val, key) {
                    delete $scope.ev[key];
                });

                $scope.ev.$sources = [{}];
                $scope.ev.$companies = [];
                $scope.ev.$tags = [];

                fecth_companies_tied_to($scope.ev, $scope.tiedTo);
                fecth_tags_tied_to($scope.ev, $scope.tiedTo);
            };

            $scope.$watch('ev.$sources', fetch_sources.bind(null, $scope.ev), true);
            $scope.$watch('tiedTo', fecth_companies_tied_to.bind(null, $scope.ev));
            $scope.$watch('tiedTo', fecth_tags_tied_to.bind(null, $scope.ev));

            $scope.vm.save = function () {
                var notify_contributed = false,
                    notify_modified = false;

                if (!$scope.vm.valid.validate()) {
                    return;
                }

                var ev = get_normalized_event($scope.ev);

                ev.sources = lodash.map($scope.ev.$sources, get_normalized_event_source);
                ev.companies = lodash.map($scope.ev.$companies, get_normalized_company_event);

                ev.tags = lodash($scope.ev.$tags)
                    .filter(is_not_suggestion)
                    .map(get_normalized_event_tag)
                    .value();

                if ($scope.ev.id && Session.USER.id !== $scope.ev.created_by) {
                    // new source added notification (do it in the server?)
                    notify_modified = sha_event($scope.ev) !== $scope.ev.$shasums.event;

                    // modification made notification (do it in the server?)
                    notify_contributed = sha_sources($scope.ev.$sources) !== $scope.ev.$shasums.sources;
                }

                Services.query.events.create(ev).then(function (ev) {
                    if (notify_modified) {
                        Services.notification.notify.modify(ev.id);
                    }

                    if (notify_contributed) {
                        Services.notification.notify.contribute(ev.id);
                    }

                    Session.emit(Session.EVENT.NOTIFY);
                    $scope.onSave({ ev: ev });

                    if (new_companies_created.length) {
                        $scope.onEvent({
                            type: EVENTS.INCOMPLETE_COMPANY_CREATED,
                            data: new_companies_created,
                        });
                    }
                }).catch(error_creating_event);
            };

            $scope.vm.query_companies = function (str, done) {
                Services.search.companies(str).then(function (res) {
                    done(null, lodash.map(res.body.results, normalize_company));
                }).catch(done);
            };

            $scope.vm.create_company = function (str, done) {
                utils.assert(str, done);
                utils.assert(Session.USER.id);

                Services.query.companies.create({
                    id: Services.query.UUID,
                    name: str,
                    guid: slug(str),
                    created_by: Session.USER.id,
                    updated_by: Session.USER.id
                }).then(function (company) {
                    new_companies_created.push(company);
                    done(null, normalize_company(company));
                }).catch(done);
            };

            $scope.vm.query_tags = function (str, done) {
                Services.search.tags(str).then(function (res) {
                    done(null, lodash.map(res.body.results, normalize_tag));
                }).catch(done);
            };

            $scope.vm.create_tag = function (str, done) {
                utils.assert(str, done);
                utils.assert(Session.USER.id);

                var tag = {
                    id: Services.query.UUID,
                    created_by: Session.USER.id,
                    updated_by: Session.USER.id
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
                $scope.vm.loading = true;

                Services.query.events.retrieve(id, ['bookmarks', 'sources', 'tags', 'companies'], ['tags', 'companies']).then(function (ev) {
                    $scope.ev = ev;
                    $scope.vm.loading = false;

                    $scope.ev.$shasums = {
                        event: sha_event(ev),
                        sources: sha_sources(ev.sources),
                    };

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

        function link($scope, $elem) {
            $scope.vm = $scope.vm || {};
            $scope.vm.add_source = function () {
                $scope.ev.$sources.push({});
                scroll_to_bottom($elem.closest('div'));
            };

            $scope.cancelTriggered = function () {
                $elem.find('.pills-container input').val('');
                $scope.onCancel();
            };
        }

        function template(elem, attrs) {
            switch (attrs.type) {
                case 'view': return HTML_VIEW;
                case 'small': return HTML_SMALL;
                default: return HTML_EDIT;
            }
        }

        return {
            replace: true,
            controller: ['$scope', controller],
            template: template,
            link: link,
            scope: {
                id: '@',
                api: '=?',
                tiedTo: '=?',
                model: '=?',
                onCancel: '&',
                onEvent: '&',
                onSave: '&',
            },
        };
    }
]);
