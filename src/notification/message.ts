import { UUID } from 'cp/lang';
const uuid = require('node-uuid');

export enum OTYPE {
    USER = <any>'user',
}

export enum CATEGORY {
    EMAIL = <any>'EMAIL',
    NOTIFICATION = <any>'NOTIFICATION',
}

export enum NOTIFICATION {
    CONTRIBUTED_TO_CONTRIBUTED_CONTENT = <any>'CONTRIBUTED_TO_CONTRIBUTED_CONTENT',
    CONTRIBUTED_TO_OWN_CONTENT = <any>'CONTRIBUTED_TO_OWN_CONTENT',
    FOLLOWED = <any>'FOLLOWED',
    MISSING_INFORMATION = <any>'MISSING_INFORMATION',
}

export interface FollowedNotificationPayload {
    id: UUID;
    otype: OTYPE;
    name: string;
}

export type SUBCATEGORY = NOTIFICATION;
export type PAYLOAD = FollowedNotificationPayload;

export default class Message {
    public id: UUID;
    public category: CATEGORY;
    public subcategory: SUBCATEGORY;
    public to: UUID;
    public date: Date;
    public payload: PAYLOAD;

    constructor(category, subcategory, to, payload) {
        this.id = uuid.v4();
        this.date = new Date;
        this.category = category;
        this.subcategory = subcategory;
        this.to = to;
        this.payload = payload;
    }
}
