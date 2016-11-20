import { Config, Type, tracking, merge } from '../utils';

export = sequelize => {
    var Company = require('./company')(sequelize);

    var Question = sequelize.define('question', merge(tracking(), {
        id: {
            type: Type.UUID,
            primaryKey: true
        },

        company_id: {
            type: Type.UUID,
            allowNull: true
        },

        title: {
            type: Type.STRING,
            validate: {
                len: [1, 500]
            },
        },

        answer: {
            type: Type.TEXT,
            validate: {
                len: [1, 5000]
            },
        },

        answered_by: {
            type: Type.UUID,
            allowNull: true,
        },

        answered_date: {
            type: Type.DATE,
            allowNull: true,
        },

        approved: {
            type: Type.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },

        approved_by: {
            type: Type.UUID,
            allowNull: true,
        },

        approved_date: {
            type: Type.DATE,
            allowNull: true,
        },
    }), Config);

    Question.belongsTo(Company);

    return Question;
};
