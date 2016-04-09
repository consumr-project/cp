'use strict';

var Q = require('q');

module.exports = {
    up: function (queryInterface, Sequelize) {
        return Q.all([
            queryInterface.removeColumn('companies', 'twitter_url'),
            queryInterface.removeColumn('companies', 'facebook_url'),
            queryInterface.removeColumn('companies', 'linkedin_url'),
        ]);
    },

    down: function (queryInterface, Sequelize) {
        return Q.when(true);
    }
};
