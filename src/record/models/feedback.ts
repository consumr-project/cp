import { Config, Type, tracking, merge } from '../utils';
import gen_user from './user';

const STAMP = require('../../../dist/stamp.json');

export = sequelize => {
    var User = gen_user(sequelize);

    var Feedback = sequelize.define('feedback', merge(tracking(), {
        id: {
            type: Type.UUID,
            allowNull: false,
            primaryKey: true
        },

        user_id: {
            type: Type.UUID,
            allowNull: false
        },

        type: {
            type: Type.ENUM('question', 'suggestion' ,'problem'),
            allowNull: false
        },

        referrer: {
            type: Type.STRING,
            validate: {
                len: [1, 100]
            },
        },

        message: {
            type: Type.TEXT,
            validate: {
                len: [1, 1000]
            },
        },
    }), merge(Config, {
        tableName: 'feedback',
        instanceMethods: {
            gen_name: function () {
                this.message = this.message || '';
                return `[${this.type}] ${this.message.substr(0, 100)}`;
            },

            gen_desc: function () {
                return `${this.message}

##### feedback record:
row id: ${this.id}
submitted by: ${this.user_id}
referrer: ${this.referrer}

##### instance stamp
stamp date: ${STAMP.date}
stamp head: ${STAMP.head}
stamp branch: ${STAMP.branch}`;
            },
        }
    }));

    Feedback.belongsTo(User);

    return Feedback;
};
