import { UUID } from '../lang';
import { v4 } from 'node-uuid';
import shasum = require('shasum');

// XXX why does this live here?
export enum OTYPE {
    COMPANY = <any>'company',
    EVENT = <any>'event',
    TAG = <any>'tag',
    USER = <any>'user',
}

export enum CATEGORY {
    EMAIL = <any>'EMAIL',
    NOTIFICATION = <any>'NOTIFICATION',
}

export enum NOTIFICATION {
    CONTRIBUTED = <any>'CONTRIBUTED',
    FAVORITED = <any>'FAVORITED',
    FOLLOWED = <any>'FOLLOWED',
    MODIFIED = <any>'MODIFIED',
}

export enum EMAIL {
    WELCOME = <any>'WELCOME',
}

export interface SingularTargetPayload {
    id: UUID;
    otype: OTYPE;
    name: string;
}

export interface MultipleTargetPayload extends SingularTargetPayload {
    obj_id: UUID;
    obj_otype: OTYPE;
    obj_name: string;
}

export interface ParentedTargetPayload extends MultipleTargetPayload {
    p_obj_id: UUID;
    p_obj_otype: OTYPE;
    p_obj_name: string;
}

export interface FollowedNotificationPayload
    extends SingularTargetPayload {}

export interface FavoritedNotificationPayload
    extends ParentedTargetPayload {}

export interface ContributedNotificationPayload
    extends MultipleTargetPayload {}

export interface ModifiedNotificationPayload
    extends MultipleTargetPayload {}

export type SUBCATEGORY = NOTIFICATION
    & EMAIL;

export type PAYLOAD = FollowedNotificationPayload
    & FavoritedNotificationPayload
    & ModifiedNotificationPayload
    & ContributedNotificationPayload;

export interface MessagePresentation {
    subcategory: SUBCATEGORY;
    date: Date;
    user_id: UUID;
    html: string;
    messages: Message[];
    is_completed: Boolean;
    href: string;
}

function signature(msg: Message): string {
    var parts = [
        msg.category,
        msg.subcategory,
        msg.to,
        msg.payload.id,
        msg.payload.otype,
    ];

    switch (msg.subcategory) {
        case NOTIFICATION.CONTRIBUTED:
        case NOTIFICATION.FAVORITED:
        case NOTIFICATION.MODIFIED:
            parts.push(msg.payload.obj_id);
            parts.push(msg.payload.obj_otype);
            break;
    }

    return shasum(parts);
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

    constructor(category, subcategory, to, payload?) {
        this.id = v4();
        this.date = new Date;
        this.category = category;
        this.subcategory = subcategory;
        this.to = to;
        this.viewed = false;
        this.completed = false;
        this.payload = payload || {};
        this.sign();
    }

    sign() {
        this.signature = signature(this);
    }
}
