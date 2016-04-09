'use strict';

var config = require('acm');

module.exports = {
    up: function (queryInterface, Sequelize) {
        var root_user_id = config('seed.root_user_id'),
            now = (new Date()).toISOString();

        console.log(root_user_id);
        return queryInterface.bulkInsert('tags', [
            {
                id: '69b3c19b-56d2-4c5f-a011-78f16f548764',
                approved: true,
                created_by: root_user_id,
                updated_by: root_user_id,
                created_date: now,
                updated_date: now,
                'en-US': 'Consumerism'
            },
            {
                id: 'cbe7af61-d3ee-413a-9704-844b084cdb25',
                approved: true,
                created_by: root_user_id,
                updated_by: root_user_id,
                created_date: now,
                updated_date: now,
                'en-US': 'Fishing'
            },
            {
                id: 'aa28bb37-62a5-4f8c-8f98-c3ca6125ef75',
                approved: true,
                created_by: root_user_id,
                updated_by: root_user_id,
                created_date: now,
                updated_date: now,
                'en-US': 'Logging'
            },
            {
                id: '322074d2-fab9-4021-935a-955e3882c731',
                approved: true,
                created_by: root_user_id,
                updated_by: root_user_id,
                created_date: now,
                updated_date: now,
                'en-US': 'Mining'
            },
            {
                id: '2cd0e8b2-7fcc-4213-aae7-353e973c9275',
                approved: true,
                created_by: root_user_id,
                updated_by: root_user_id,
                created_date: now,
                updated_date: now,
                'en-US': 'Pollution'
            },
            {
                id: 'c7ee4e81-ac12-4c14-bc69-ae02042a69d8',
                approved: true,
                created_by: root_user_id,
                updated_by: root_user_id,
                created_date: now,
                updated_date: now,
                'en-US': 'Resource'
            },
            {
                id: 'daf9d0b3-6a21-4baf-a9d2-02602913971a',
                approved: true,
                created_by: root_user_id,
                updated_by: root_user_id,
                created_date: now,
                updated_date: now,
                'en-US': 'Toxicants'
            },
            {
                id: 'd7591d06-44d5-4d2c-bfa3-20c126d8af9a',
                approved: true,
                created_by: root_user_id,
                updated_by: root_user_id,
                created_date: now,
                updated_date: now,
                'en-US': 'Waste'
            },
            {
                id: '807cad2f-e3ab-4507-896d-71348dfd4aa0',
                approved: true,
                created_by: root_user_id,
                updated_by: root_user_id,
                created_date: now,
                updated_date: now,
                'en-US': 'Water'
            },
        ]);
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.bulkDelete('tags', {
            id: {
                $in: [
                    '69b3c19b-56d2-4c5f-a011-78f16f548764',
                    'cbe7af61-d3ee-413a-9704-844b084cdb25',
                    'aa28bb37-62a5-4f8c-8f98-c3ca6125ef75',
                    '322074d2-fab9-4021-935a-955e3882c731',
                    '2cd0e8b2-7fcc-4213-aae7-353e973c9275',
                    'c7ee4e81-ac12-4c14-bc69-ae02042a69d8',
                    'daf9d0b3-6a21-4baf-a9d2-02602913971a',
                    'd7591d06-44d5-4d2c-bfa3-20c126d8af9a',
                    '807cad2f-e3ab-4507-896d-71348dfd4aa0',
                ]
            }
        });
    }
};
