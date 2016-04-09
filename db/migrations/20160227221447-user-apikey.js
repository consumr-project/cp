'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.addColumn('users', 'auth_apikey', {
            type: Sequelize.STRING
        });
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.removeColumn('users', 'auth_apikey');
    }
};
