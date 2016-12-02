import { Config, Type, tracking, merge } from '../utils';
import { IdentifiableMessage, StampedMessage } from '../message';

export interface CompanyMessage extends IdentifiableMessage, StampedMessage {
    name: string;
    summary?: string;
    guid: string;
    website_url?: string;
    wikipedia_url?: string;
    twitter_handle?: string;
}

export default sequelize =>
    sequelize.define('company', merge(tracking(), {
        id: {
            type: Type.UUID,
            primaryKey: true
        },

        guid: {
            type: Type.STRING,
            unique: true
        },

        name: {
            type: Type.STRING,
            allowNull: false
        },

        summary: {
            type: Type.TEXT
        },

        wikipedia_url: {
            type: Type.TEXT
        },

        website_url: {
            type: Type.TEXT
        },

        twitter_handle: {
            type: Type.TEXT
        },
    }), Config);
