import { UUID } from 'cp/lang';
import uuid = require('node-uuid');
import shasum = require('shasum');

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

function signature(msg: Message): string {
    switch (msg.subcategory) {
        case NOTIFICATION.FOLLOWED: return shasum([
            msg.category,
            msg.subcategory,
            msg.to,
            msg.payload.id,
            msg.payload.otype,
        ]);
    }
}

export default class Message {
    public id: UUID;
    public signature: string;
    public category: CATEGORY;
    public subcategory: SUBCATEGORY;
    public to: UUID;
    public viewed: Boolean;
    public completed: Boolean;
    public date: Date;
    public payload: PAYLOAD;

    constructor(category, subcategory, to, payload) {
        this.id = uuid.v4();
        this.date = new Date;
        this.category = category;
        this.subcategory = subcategory;
        this.to = to;
        this.payload = payload;
        this.viewed = false;
        this.completed = false;
        this.signature = signature(this);
    }
}
