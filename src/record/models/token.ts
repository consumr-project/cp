import { Config, Type, tracking, merge } from '../utils';
import { IdentifiableMessage, StampedMessage } from '../message';

export interface TokenMessage extends IdentifiableMessage, StampedMessage {
    token: string;
    pub?: string;
    used?: boolean;
    used_date?: Date;
    expiration_date: Date;
}

export default sequelize =>
    sequelize.define('token', merge(tracking(), {
        id: {
            type: Type.UUID,
            primaryKey: true
        },

        token: {
            type: Type.STRING,
            allowNull: false
        },

        used: {
            type: Type.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },

        used_date: {
            type: Type.DATE,
            allowNull: true,
        },

        expiration_date: {
            type: Type.DATE,
            allowNull: false,
        },

        reason: {
            type: Type.STRING,
            allowNull: false,
        },
    }), Config);
