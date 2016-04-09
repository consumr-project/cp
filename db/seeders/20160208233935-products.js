'use strict';

var config = require('acm');

module.exports = {
    up: function (queryInterface, Sequelize) {
        var root_user_id = config('seed.root_user_id'),
            now = (new Date()).toISOString();

        return queryInterface.bulkInsert('products', [
            {
                id: '674fecec-c20a-4178-860d-1250ab9931af',
                approved: true,
                created_by: root_user_id,
                updated_by: root_user_id,
                created_date: now,
                updated_date: now,
                'en-US': 'Apparel'
            },
            {
                id: '5a57ad06-acde-47d8-bb83-35fb184cd5fe',
                approved: true,
                created_by: root_user_id,
                updated_by: root_user_id,
                created_date: now,
                updated_date: now,
                'en-US': 'Produce'
            },
            {
                id: '372db508-ce56-4c42-a989-11898eeeab33',
                approved: true,
                created_by: root_user_id,
                updated_by: root_user_id,
                created_date: now,
                updated_date: now,
                'en-US': 'Medicine'
            },
            {
                id: 'c5391b93-9226-42e2-86d3-ca08e6c015cc',
                approved: true,
                created_by: root_user_id,
                updated_by: root_user_id,
                created_date: now,
                updated_date: now,
                'en-US': 'Shoes'
            },
            {
                id: '9a0885d3-dd80-439e-8941-9188efabb95d',
                approved: true,
                created_by: root_user_id,
                updated_by: root_user_id,
                created_date: now,
                updated_date: now,
                'en-US': 'Jeans'
            },
            {
                id: '43262996-374d-4501-9093-2c4de30e26be',
                approved: true,
                created_by: root_user_id,
                updated_by: root_user_id,
                created_date: now,
                updated_date: now,
                'en-US': 'Fruits'
            },
            {
                id: '9c0685c9-640e-4e0c-a4fb-4be401faa64a',
                approved: true,
                created_by: root_user_id,
                updated_by: root_user_id,
                created_date: now,
                updated_date: now,
                'en-US': 'Chocolate'
            },
            {
                id: '87a85299-cf93-4a3d-be8a-f6054b018712',
                approved: true,
                created_by: root_user_id,
                updated_by: root_user_id,
                created_date: now,
                updated_date: now,
                'en-US': 'Furniture'
            },
            {
                id: '88062f30-a981-439b-b1a9-7d197d002b03',
                approved: true,
                created_by: root_user_id,
                updated_by: root_user_id,
                created_date: now,
                updated_date: now,
                'en-US': 'Automobiles'
            },
        ]);
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.bulkDelete('tags', {
            id: {
                $in: [
                    '674fecec-c20a-4178-860d-1250ab9931af',
                    '5a57ad06-acde-47d8-bb83-35fb184cd5fe',
                    '372db508-ce56-4c42-a989-11898eeeab33',
                    'c5391b93-9226-42e2-86d3-ca08e6c015cc',
                    '9a0885d3-dd80-439e-8941-9188efabb95d',
                    '43262996-374d-4501-9093-2c4de30e26be',
                    '9c0685c9-640e-4e0c-a4fb-4be401faa64a',
                    '87a85299-cf93-4a3d-be8a-f6054b018712',
                    '88062f30-a981-439b-b1a9-7d197d002b03',
                ]
            }
        });
    }
};
