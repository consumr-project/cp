angular.module('tcp').service('Services', [
    '$http',
    '$q',
    '$cacheFactory',
    'lodash',
    function ($http, $q, $cacheFactory, lodash) {
        'use strict';

        var authService = {},
            notificationService = {},
            extractService = {},
            searchService = {},
            userService = {},
            queryService = {};

        /**
         * @param {Function} fn
         * @return {Angular.Cache?}
         */
        function cacheable(fn) {
            fn.cache = fn.cache || $cacheFactory(rand_id());
            return fn.cache;
        }

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
        function url() {
            return '/service/record/' + lodash.filter(arguments).join('/');
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
         * @return {string}
         */
        function rand_id() {
            return lodash.uniqueId() + '-' + Date.now();
        }

        /**
         * @param {String} model
         * @param {Array} [associataions]
         * @return {Object}
         */
        function crud(model, associations) {
            var cache1 = $cacheFactory(rand_id());
            var cache2 = $cacheFactory(rand_id());

            return lodash.reduce(associations, function (methods, assoc) {
                methods[assoc] = {
                    cache: cache2,
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
                            cache: cache2
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
                cache: cache1,
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
                        cache: cache1
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

        queryService.stats = {};

        queryService.stats.trending = function () {
            return get(url('stats/trending'), { cache: true });
        };

        queryService.stats.mine = function () {
            return get(url('stats/mine'), { cache: true });
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

        queryService.companies.guid = function (guid) {
            return $http.get(url('companies/guid', guid), { cache: true })
                .then(pluck_data).then(pluck_body);
        };

        queryService.companies.missing_data = function (limit) {
          return get(url('companies/missing-data'), {
              params: {
                  limit: limit
              }
          });
        };

        queryService.companies.common = {
            companies: function (guid) {
                return $http.get(url('companies', guid, 'common/companies'), { cache: queryService.companies.common.cache })
                    .then(pluck_data).then(pluck_body);
            },

            tags: function (guid) {
                return $http.get(url('companies', guid, 'common/tags'), { cache: queryService.companies.common.cache })
                    .then(pluck_data).then(pluck_body);
            },
        };

        queryService.companies.common.cache = $cacheFactory(rand_id());

        queryService.tags.common = {
            companies: function (id) {
                return $http.get(url('tags', id, 'common/companies'), { cache: queryService.tags.common.cache })
                    .then(pluck_data).then(pluck_body);
            },

            tags: function (id) {
                return $http.get(url('tags', id, 'common/tags'), { cache: queryService.tags.common.cache })
                    .then(pluck_data).then(pluck_body);
            },
        };

        queryService.tags.common.cache = $cacheFactory(rand_id());

        queryService.tags.mine = function () {
            return get(url('tags/mine'));
        };

        queryService.tags.events = queryService.tags.events || {};
        queryService.tags.events.timeline = function (id, user_id) {
            return $http.get(url('tags', id, 'events/timeline'), {
                cache: queryService.tags.events.timeline.cache,
                params: {
                    user_id: user_id
                }
            }).then(pluck_data).then(pluck_body);
        };
        queryService.tags.events.timeline.cache = $cacheFactory('queryService.tags.events.timeline');

        queryService.companies.events.timeline = function (id, user_id) {
            return $http.get(url('companies', id, 'events/timeline'), {
                cache: queryService.companies.events.timeline.cache,
                params: {
                    user_id: user_id
                }
            }).then(pluck_data).then(pluck_body);
        };
        queryService.companies.events.timeline.cache = $cacheFactory('queryService.companies.events.timeline.cache');

        queryService.companies.reviews.view = function (id, user_id, offset) {
            return $http.get(url('companies', id, 'reviews'), {
                cache: queryService.companies.reviews.view.cache,
                params: {
                    offset: offset || 0,
                    user_id: user_id
                }
            }).then(pluck_data).then(pluck_body);
        };
        queryService.companies.reviews.view.cache = $cacheFactory('queryService.companies.reviews.view.cache');

        queryService.companies.reviews.summary = function (id) {
            return $http.get(url('companies', id, 'reviews/summary'), {
                cache: queryService.companies.reviews.summary.cache
            }).then(pluck_data).then(pluck_body);
        };
        queryService.companies.reviews.summary.cache = $cacheFactory('queryService.companies.reviews.summary.cache');

        queryService.companies.reviews.score = function (id) {
            return $http.get(url('companies', id, 'reviews/score'), { cache: true })
                .then(pluck_data).then(pluck_body);
        };

        queryService.admin = {
            beta_email_invites: {
                retrieve: function () {
                    return get(url('beta_email_invites'));
                },
                approve: function (email) {
                    return put(url('beta_email_invites/approve'), { email: email });
                },
                create: function (email, recaptcha) {
                    return post(url('beta_email_invites'), {
                        email: email,
                        recaptcha: recaptcha,
                    });
                },
                create_approved: function (email) {
                    return post(url('beta_email_invites/create_approved'), { email: email });
                }
            },

            site_stats: function () {
                return get(url('stats/site'));
            },
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
         * @param {String} query "%" wrapped
         * @param {Number} limit (default: 100)
         * @param {Number} offset (default: 0)
         * @return {Promise}
         */
        searchService.tags = function (query, limit, offset) {
            limit = limit || 100;
            offset = offset || 0;

            return $http.get('/service/search/tags', {
                timeout: abortable(searchService.tags),
                cache: cacheable(searchService.tags),
                params: {
                    q: query,
                    limit: limit,
                    offset: offset,
                }
            }).then(pluck_data);
        };

        abortable(searchService.tags);
        cacheable(searchService.tags);

        /**
         * @param {String} query "%" wrapped
         * @param {Number} limit (default: 100)
         * @param {Number} offset (default: 0)
         * @return {Promise}
         */
        searchService.products = function (query, limit, offset) {
            limit = limit || 100;
            offset = offset || 0;

            return $http.get('/service/search/products', {
                timeout: abortable(searchService.products),
                params: {
                    q: query,
                    limit: limit,
                    offset: offset,
                }
            }).then(pluck_data);
        };

        abortable(searchService.products);

        /**
         * @param {String} query "%" wrapped
         * @param {Number} limit (default: 100)
         * @param {Number} offset (default: 0)
         * @return {Promise}
         */
        searchService.companies = function (query, limit, offset) {
            limit = limit || 100;
            offset = offset || 0;

            return $http.get('/service/search/companies', {
                timeout: abortable(searchService.companies),
                params: {
                    q: query,
                    limit: limit,
                    offset: offset,
                }
            }).then(pluck_data);
        };

        abortable(searchService.companies);

        /**
         * @param {String} query "%" wrapped
         * @param {Number} limit (default: 100)
         * @param {Number} offset (default: 0)
         * @return {Promise}
         */
        searchService.query = function (query, limit, offset) {
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
            return get('/service/auth/user');
        };

        /**
         * @return {Promise}
         */
        authService.get_user_email = function () {
            return get('/service/auth/user/email');
        };

        /**
         * @return {Promise}
         */
        authService.set_user_email = function (email) {
            return put('/service/auth/user/email', { email: email });
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

        /**
         * @param {String} id
         * @param {String} p_id
         * @param {String} p_otype
         * @return {Promise}
         */
        notificationService.notify.favorite = function (id, p_id, p_otype) {
            return post('/service/notification/favorite', {
                id: id,
                p_id: p_id,
                p_otype: p_otype
            });
        };

        /**
         * @param {String} id
         * @return {Promise}
         */
        notificationService.notify.unfavorite = function (id) {
            return del('/service/notification/favorite/' + id);
        };

        /**
         * @param {String} id
         * @return {Promise}
         */
        notificationService.notify.contribute = function (id) {
            return post('/service/notification/contribute', {id: id});
        };

        /**
         * @param {String} id
         * @return {Promise}
         */
        notificationService.notify.uncontribute = function (id) {
            return del('/service/notification/contribute/' + id);
        };

        /**
         * @param {String} id
         * @return {Promise}
         */
        notificationService.notify.modify = function (id) {
            return post('/service/notification/modify', {id: id});
        };

        /**
         * @param {String} id
         * @return {Promise}
         */
        notificationService.notify.unmodify = function (id) {
            return del('/service/notification/modify/' + id);
        };

        /**
         * @param {String} data
         * @return {Promise}
         */
        userService.upload_avatar = function (data) {
            return post('/service/user/upload', {data: data});
        };

        return {
            auth: authService,
            extract: extractService,
            notification: notificationService,
            search: searchService,
            user: userService,
            query: queryService
        };
    }
]);
