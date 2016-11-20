import { Config, Type, tracking, merge } from '../utils';
import { UUID, Date2, } from '../../lang';

export enum Role {
    admin = <any>'admin',
    user = <any>'user',
}

export enum Language {
    en = <any>'en',
}

export interface UserMessage {
    id?: UUID;
    name?: string;
    email?: string;
    title?: string;
    company_name?: string;
    role?: Role;
    lang?: Language;
    summary?: string;
    member_number?: number;
    avatar_url?: string;
    linkedin_url?: string;
    last_login_date?: Date2;
    auth_linkedin_id?: string;
    auth_apikey?: string;
}

export default sequelize =>
    sequelize.define('user', merge(tracking(), {
        id: {
            type: Type.UUID,
            primaryKey: true
        },

        name: {
            type: Type.STRING,
            allowNull: false
        },

        email: {
            type: Type.STRING,
            allowNull: false
        },

        title: {
            type: Type.STRING
        },

        company_name: {
            type: Type.STRING
        },

        role: {
            type: Type.ENUM('admin', 'user'),
            defaultValue: 'user',
            allowNull: false
        },

        lang: {
            type: Type.ENUM('en'),
            defaultValue: 'en',
            allowNull: false
        },

        summary: {
            type: Type.TEXT
        },

        member_number: {
            type: Type.INTEGER,
        },

        avatar_url: {
            type: Type.STRING
        },

        linkedin_url: {
            type: Type.STRING
        },

        last_login_date: {
            type: Type.DATE
        },

        auth_linkedin_id: {
            type: Type.STRING
        },

        auth_apikey: {
            type: Type.STRING
        }
    }), Config);
