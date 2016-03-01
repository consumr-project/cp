angular.module('tcp').service('ServicesService', [
    '$http',
    '$q',
    'lodash',
    function ($http, $q, lodash) {
        'use strict';

        var authService = {},
            notificationService = {},
            extractService = {},
            searchService = {},
            queryService = {};

        /**
         * @param {Function} fn
         * @return {Promise}
         */
        function abortable(fn) {
            var def = $q.defer();

            fn.cancel = function () {
                return def.resolve();
            };

            return def.promise;
        }

        /**
         * @param {$http.Response} res
         * @return {$http.Response.data}
         */
        function pluck_data(res) {
            return res.data;
        }

        /**
         * @param {$http.Response.data} data
         * @return {$http.Response.data.body}
         */
        function pluck_body(data) {
            return data.body;
        }

        /**
         * @param {String} model
         * @param {String} id
         * @return {String}
         */
        function url(model, id) {
            return '/service/query/' + lodash.filter(arguments).join('/');
        }

        /**
         * @param {String} model
         * @param {Array} [associataions]
         * @return {Object}
         */
        function crud(model, associations) {
            return lodash.reduce(associations, function (methods, assoc) {
                methods[assoc] = {
                    create: function (parent_id, data) {
                        return $http.post(url(model, parent_id, assoc), data)
                            .then(pluck_data).then(pluck_body);
                    },
                    upsert: function (parent_id, data) {
                        return $http.patch(url(model, parent_id, assoc), data)
                            .then(pluck_data).then(pluck_body);
                    },
                    retrieve: function (parent_id, id, parts, expand) {
                        var opt = {};

                        if (parts) {
                            opt.params = {
                                parts: parts.join(',')
                            };
                        }

                        if (parts && expand) {
                            opt.params.expand = expand.join(',');
                        }

                        return $http.get(url(model, parent_id, assoc, id), opt)
                            .then(pluck_data).then(pluck_body);
                    },
                    update: function (parent_id, id, data) {
                        return $http.put(url(model, parent_id, assoc, id), data)
                            .then(pluck_data).then(pluck_body);
                    },
                    delete: function (parent_id, id) {
                        return $http.delete(url(model, parent_id, assoc, id))
                            .then(pluck_data).then(pluck_body);
                    }
                };
                return methods;
            }, {
                create: function (data) {
                    return $http.post(url(model), data)
                        .then(pluck_data).then(pluck_body);
                },
                upsert: function (data) {
                    return $http.patch(url(model), data)
                        .then(pluck_data).then(pluck_body);
                },
                retrieve: function (id, parts, expand) {
                    var opt = {};

                    if (parts) {
                        opt.params = {
                            parts: parts.join(',')
                        };
                    }

                    if (parts && expand) {
                        opt.params.expand = expand.join(',');
                    }

                    return $http.get(url(model, id), opt)
                        .then(pluck_data).then(pluck_body);
                },
                update: function (id, data) {
                    return $http.put(url(model, id), data)
                        .then(pluck_data).then(pluck_body);
                },
                delete: function (id) {
                    return $http.delete(url(model, id))
                        .then(pluck_data).then(pluck_body);
                },
            });
        }

        queryService = {
            UUID: '$UUID',
            companies: crud('companies', ['followers', 'events', 'products']),
            events: crud('events', ['sources', 'tags', 'companies', 'bookmarks']),
            tags: crud('tags'),
            products: crud('products'),
            users: crud('users'),
        };

        queryService.search = {
            products: function (field, query) {
                return $http.get(url('search/products', field), { params: { q: query } })
                    .then(pluck_data).then(pluck_body);
            },
            tags: function (field, query) {
                return $http.get(url('search/tags', field), { params: { q: query } })
                    .then(pluck_data).then(pluck_body);
            },
            companies: function (field, query) {
                return $http.get(url('search/companies', field), { params: { q: query } })
                    .then(pluck_data).then(pluck_body);
            }
        };

        queryService.companies.guid = function (guid) {
            return $http.get(url('companies/guid', guid))
                .then(pluck_data).then(pluck_body);
        };

        /**
         * @param {String} url
         * @return {Promise}
         */
        extractService.page = function (url) {
            return $http.get('/service/extract/page?url=' + encodeURIComponent(url));
        };

        extractService.wikipedia = {};

        /**
         * @param {String} query
         * @return {Promise}
         */
        extractService.wikipedia.extract = function (query) {
            return $http.get('/service/extract/wiki/extract', {
                timeout: abortable(extractService.wikipedia.extract),
                params: {
                    q: query
                }
            }).then(pluck_data);
        };

        abortable(extractService.wikipedia.extract);

        /**
         * @param {String} query
         * @return {Promise}
         */
        extractService.wikipedia.search = function (query) {
            return $http.get('/service/extract/wiki/search', {
                timeout: abortable(extractService.wikipedia.search),
                params: {
                    q: query
                }
            }).then(pluck_data);
        };

        abortable(extractService.wikipedia.search);

        /**
         * @param {String} query
         * @return {Promise}
         */
        extractService.wikipedia.infobox = function (query) {
            return $http.get('/service/extract/wiki/infobox', {
                timeout: abortable(extractService.wikipedia.infobox),
                params: {
                    q: query,
                    parts: 'urls',
                }
            }).then(pluck_data);
        };

        abortable(extractService.wikipedia.infobox);

        /**
         * @param {String} query
         * @return {Promise}
         */
        extractService.crunchbase = function (query) {
            return $http.get('/service/extract/crunchbase/companies', {
                timeout: abortable(extractService.crunchbase),
                params: {
                    q: query
                }
            }).then(pluck_data);
        };

        abortable(extractService.crunchbase);

        /**
         * interface SearchConfiguration {
         *     index: String (default: entity)
         *     type: String (default: undefined)
         *     size: Number (default: 50)
         *     from: Number (default: 0)
         * }
         *
         * @param {String} str
         * @param {SearchConfiguration} [config]
         * @return {Promise}
         */
        searchService.fuzzy = function (str, config) {
            config = config || {};
            return $http.get('/service/search/fuzzy', {
                params: {
                    query: str,
                    index: config.index || 'entity',
                    type: config.type,
                    size: config.size || 50,
                    from: config.from || 0
                }
            });
        };

        /**
         * @param {String} query "%" wrapped
         * @param {Number} limit (default: 100)
         * @param {Number} offset (default: 0)
         * @return {Promise}
         */
        searchService.query = function (query, limit, offset) {
            query = "%" + query + "%";
            limit = limit || 100;
            offset = offset || 0;

            return $http.get('/service/search/query', {
                timeout: abortable(searchService.query),
                params: {
                    q: query,
                    limit: limit,
                    offset: offset,
                }
            }).then(pluck_data);
        };

        abortable(searchService.query);

        /**
         * @return {Promise}
         */
        authService.user = function () {
            return $http.get('/service/auth/user').then(pluck_data);
        };

        /**
         * @return {Promise}
         */
        authService.logout = function () {
            return $http.get('/service/auth/logout');
        };

        /**
         * @return {Window}
         */
        authService.login = function (provider) {
            return window.open('/service/auth/' + provider, 'cp_auth_' + provider, [
                'menubar=no',
                'location=yes',
                'resizable=yes',
                'scrollbars=yes',
                'status=no',
                'height=750',
                'width=800',
                'left=100'
            ].join(','));
        };

        notificationService.TYPE = {
            MISSING_INFORMATION: 'MISSING_INFORMATION'
        };

        /**
         * @param {notificationService.TYPE} [type]
         * @return {Promise}
         */
        notificationService.get = function (type) {
            type = type ? '/' + type.toLowerCase() : '';
            return $http.get('/service/notification/notifications' + type, {
                timeout: abortable(notificationService.get)
            }).then(pluck_data);
        };

        abortable(notificationService.get);

        /**
         * @param {String} id
         * @return {Promise}
         */
        notificationService.delete = function (id) {
            return $http.delete('/service/notification/notifications/' + id, {
                timeout: abortable(notificationService.delete)
            }).then(pluck_data);
        };

        abortable(notificationService.delete);

        /**
         * @param {String} id
         * @return {Promise}
         */
        notificationService.missing_information = function (payload) {
            return $http.post('/service/notification/notifications/missing_information', payload)
              .then(pluck_data);
        };

        return {
            auth: authService,
            extract: extractService,
            notification: notificationService,
            search: searchService,
            query: queryService
        };
    }
]);
