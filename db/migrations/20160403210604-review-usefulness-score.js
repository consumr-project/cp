'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.addColumn('review_usefulnesses', 'score', {
            type: Sequelize.INTEGER
        });
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.removeColumn('review_usefulnesses', 'score');
    }
};
