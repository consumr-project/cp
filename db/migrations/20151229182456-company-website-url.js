'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.addColumn('companies', 'website_url', {
            type: Sequelize.STRING
        });
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.removeColumn('companies', 'website_url');
    }
};
