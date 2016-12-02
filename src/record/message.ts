import { UUID, Date2 } from '../lang';

export interface StampedMessage {
    created_by?: string;
    created_date?: Date2;
    updated_by?: string;
    updated_date?: Date2;
    deleted_by?: string;
    deleted_date?: Date2;
}

export interface IdentifiableMessage {
    id?: UUID;
}
