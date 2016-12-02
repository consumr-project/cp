import { Config, Type, tracking, merge } from '../utils';
import { Date2 } from '../../lang';
import { IdentifiableMessage, StampedMessage } from '../message';

export interface EventMessage extends IdentifiableMessage, StampedMessage {
    title?: string;
    date?: Date2;
    logo?: string;
}

export default sequelize =>
    sequelize.define('event', merge(tracking(), {
        id: {
            type: Type.UUID,
            primaryKey: true
        },

        title: {
            type: Type.STRING,
            allowNull: false
        },

        date: {
            type: Type.DATE,
            allowNull: false
        },

        logo: {
            type: Type.STRING,
            allowNull: false
        },
    }), Config);
