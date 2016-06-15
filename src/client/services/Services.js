angular.module('tcp').service('Services', [
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
         * @param {String} method
         * @param {String} url
         * @param {Object} [args]
         * @return {Promise}
         */
        function http(method, url, args) {
            return $http[method](url, args)
                .then(pluck_data)
                .then(pluck_body);
        }

        /**
         * @param {String} url
         * @param {Object} [args]
         * @return {Promise}
         */
        function get(url, args) {
            return http('get', url, args);
        }

        /**
         * @param {String} url
         * @param {Object} [args]
         * @return {Promise}
         */
        function put(url, args) {
            return http('put', url, args);
        }

        /**
         * @param {String} url
         * @param {Object} [args]
         * @return {Promise}
         */
        function post(url, args) {
            return http('post', url, args);
        }

        /**
         * @param {String} url
         * @param {Object} [args]
         * @return {Promise}
         */
        function del(url, args) {
            return http('delete', url, args);
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
                        var opt = {
                            cache: true
                        };

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
                    var opt = {
                        cache: true
                    };

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
            companies: crud('companies', ['followers', 'events', 'products', 'reviews']),
            events: crud('events', ['sources', 'tags', 'companies', 'bookmarks']),
            tags: crud('tags', ['followers']),
            products: crud('products'),
            users: crud('users', ['followers']),
            feedback: crud('feedback'),
            reviews: crud('reviews', ['useful']),
        };

        queryService.users.stats = function (id) {
            return get(url('users', id, 'stats'), { cache: true });
        };

        queryService.users.stats.contributions = {};
        queryService.users.stats.followers = {};
        queryService.users.stats.following = {};
        queryService.users.stats.favorites = {};

        queryService.users.stats.contributions.reviews = function (id) {
            return get(url('users', id, 'stats/contributions/reviews'), { cache: true });
        };

        queryService.users.stats.contributions.events = function (id) {
            return get(url('users', id, 'stats/contributions/events'), { cache: true });
        };

        queryService.users.stats.contributions.questions = function (id) {
            return get(url('users', id, 'stats/contributions/questions'), { cache: true });
        };

        queryService.users.stats.contributions.companies = function (id) {
            return get(url('users', id, 'stats/contributions/companies'), { cache: true });
        };

        queryService.users.stats.contributions.sources = function (id) {
            return get(url('users', id, 'stats/contributions/sources'), { cache: true });
        };

        queryService.users.stats.favorites.events = function (id) {
            return get(url('users', id, 'stats/favorites/events'), { cache: true });
        };

        queryService.users.stats.following.tags = function (id) {
            return get(url('users', id, 'stats/following/tags'), { cache: true });
        };

        queryService.users.stats.following.companies = function (id) {
            return get(url('users', id, 'stats/following/companies'), { cache: true });
        };

        queryService.users.stats.following.users = function (id) {
            return get(url('users', id, 'stats/following/users'), { cache: true });
        };

        queryService.users.stats.followers.users = function (id) {
            return get(url('users', id, 'stats/followers/users'), { cache: true });
        };

        queryService.multi_search = {
            tags: function (tags) {
                return $http.get(url('tags/like'), { params: { s: tags } })
                    .then(pluck_data).then(pluck_body);
            }
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
            return $http.get(url('companies/guid', guid), { cache: true })
                .then(pluck_data).then(pluck_body);
        };

        queryService.companies.common = {
            companies: function (guid) {
                return $http.get(url('companies', guid, 'common/companies'), { cache: true })
                    .then(pluck_data).then(pluck_body);
            },

            tags: function (guid) {
                return $http.get(url('companies', guid, 'common/tags'), { cache: true })
                    .then(pluck_data).then(pluck_body);
            },
        };

        queryService.tags.common = {
            companies: function (id) {
                return $http.get(url('tags', id, 'common/companies'), { cache: true })
                    .then(pluck_data).then(pluck_body);
            },

            tags: function (id) {
                return $http.get(url('tags', id, 'common/tags'), { cache: true })
                    .then(pluck_data).then(pluck_body);
            },
        };

        queryService.tags.events = queryService.tags.events || {};
        queryService.tags.events.timeline = function (id, user_id) {
            return $http.get(url('tags', id, 'events/timeline'), {
                cache: true,
                params: {
                    user_id: user_id
                }
            }).then(pluck_data).then(pluck_body);
        };

        queryService.companies.events.timeline = function (id, user_id) {
            return $http.get(url('companies', id, 'events/timeline'), {
                cache: true,
                params: {
                    user_id: user_id
                }
            }).then(pluck_data).then(pluck_body);
        };

        queryService.companies.reviews.view = function (id, user_id, offset) {
            return $http.get(url('companies', id, 'reviews'), {
                cache: true,
                params: {
                    offset: offset || 0,
                    user_id: user_id
                }
            }).then(pluck_data).then(pluck_body);
        };

        queryService.companies.reviews.summary = function (id) {
            return $http.get(url('companies', id, 'reviews/summary'), { cache: true })
                .then(pluck_data).then(pluck_body);
        };

        queryService.companies.reviews.score = function (id) {
            return $http.get(url('companies', id, 'reviews/score'), { cache: true })
                .then(pluck_data).then(pluck_body);
        };

        /**
         * @param {String} url
         * @return {Promise}
         */
        extractService.page = function (url) {
            return $http.get('/service/extract/page?url=' + encodeURIComponent(url), { cache: true });
        };

        extractService.wikipedia = {};

        /**
         * @param {String} query
         * @return {Promise}
         */
        extractService.wikipedia.extract = function (query) {
            return $http.get('/service/extract/wiki/extract', {
                cache: true,
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
                cache: true,
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
                cache: true,
                timeout: abortable(extractService.wikipedia.infobox),
                params: {
                    q: query,
                    parts: 'urls',
                }
            }).then(pluck_data);
        };

        abortable(extractService.wikipedia.infobox);

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

        /**
         * @return {Promise}
         */
        notificationService.get = function () {
            return get('/service/notification');
        };

        /**
         * @param {String[]} ids
         * @return {Promise}
         */
        notificationService.completed = function (ids) {
            return put('/service/notification/completed', { ids: ids });
        };

        /**
         * @param {String[]} ids
         * @return {Promise}
         */
        notificationService.viewed = function (ids) {
            return put('/service/notification/viewed', { ids: ids });
        };

        notificationService.notify = {};

        /**
         * @param {String} id
         * @return {Promise}
         */
        notificationService.notify.follow = function (id) {
            return post('/service/notification/follow', {id: id});
        };

        /**
         * @param {String} id
         * @return {Promise}
         */
        notificationService.notify.unfollow = function (id) {
            return del('/service/notification/follow/' + id);
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
