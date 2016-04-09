'use strict';

var config = require('acm');

module.exports = {
    up: function (queryInterface, Sequelize) {
        var root_user_id = config('seed.root_user_id'),
            now = (new Date()).toISOString();

        return queryInterface.bulkInsert('users', [
            {
                id: root_user_id,
                created_by: root_user_id,
                updated_by: root_user_id,
                created_date: now,
                updated_date: now,
                last_login_date: now,
                name: 'Consurm Project',
                email: 'root@consumrproject.org',
                title: 'Consurm Project Admin',
                company_name: 'Consurm Project',
                lang: 'en',
                role: 'admin',
            }
        ]);
    },

    down: function (queryInterface, Sequelize) {
        var root_user_id = config('seed.root_user_id');

        return queryInterface.bulkDelete('users', {
            id: {
                $in: [root_user_id]
            }
        });
    }
};
