const uuid = require('node-uuid');

export enum TYPE {
    EMAIL = <any>'EMAIL',
    NOTIFICATION = <any>'NOTIFICATION',
};

export default class Message {
    public id: string;
    public type: TYPE;
    public to: string;
    public date: Date;
    public subject: string;
    public payload: any;

    constructor({ id = null, type = TYPE.NOTIFICATION, subject, to = '', payload = {} }) {
        if (!(type in TYPE)) {
            throw new Error(`Invalid type: ${type}`);
        }

        this.id = id || uuid.v4();
        this.type = type;
        this.to = to;
        this.date = new Date();
        this.subject = subject;
        this.payload = payload;
    }
}
