import { UUID } from 'cp/lang';
import uuid = require('node-uuid');
import shasum = require('shasum');

export enum OTYPE {
    USER = <any>'user',
    EVENT = <any>'event',
}

export enum CATEGORY {
    EMAIL = <any>'EMAIL',
    NOTIFICATION = <any>'NOTIFICATION',
}

export enum NOTIFICATION {
    FOLLOWED = <any>'FOLLOWED',
    FAVORITED = <any>'FAVORITED',
}

export interface FollowedNotificationPayload {
    id: UUID;
    otype: OTYPE;
    name: string;
}

export interface FavoritedNotificationPayload {
    id: UUID;
    otype: OTYPE;
    name: string;
    obj_id: UUID;
    obj_otype: OTYPE;
    obj_name: string;
}

export type SUBCATEGORY = NOTIFICATION;
export type PAYLOAD = FollowedNotificationPayload
    | FavoritedNotificationPayload;

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
    public category: CATEGORY;
    public subcategory: SUBCATEGORY;

    // uniq string used to track duplicate messages. see signature function
    public signature: string;

    // id of user this notification is going to
    public to: UUID;

    // has this message been seen by the user?
    public viewed: Boolean;

    // has an action been take upon this notification by the user?
    public completed: Boolean;

    // when was this created?
    public date: Date;

    // any information specific to this type of message
    public payload: PAYLOAD;

    constructor(category, subcategory, to, payload) {
        this.id = uuid.v4();
        this.date = new Date;
        this.category = category;
        this.subcategory = subcategory;
        this.to = to;
        this.viewed = false;
        this.completed = false;
        this.payload = payload;
        this.signature = signature(this);
    }
}
