/// <reference path="../typings.d.ts"/>

'use strict';

import {Promise} from 'q';

export default class FirebaseRequest<RequestPayload, ResponsePayload> {
    protected service_ref: Firebase;
    protected response_transformer: (any) => ResponsePayload = x => x;

    constructor(service_ref: Firebase) {
        this.service_ref = service_ref;
    }

    protected exec(val: RequestPayload): Promise<ResponsePayload> {
        var job: Firebase = this.service_ref.push(val),
            tracker: number = 0;

        return Promise<ResponsePayload>((resolve, reject) => {
            this.service_ref.child(job.key()).on('value', function handler(res) {
                let raw;

                if (++tracker !== 2) {
                    return;
                }

                raw = res.val();
                resolve(<ResponsePayload>this.response_transformer(raw));
                res.ref().off('value', handler);
                res.ref().remove();
            }.bind(this));
        });
    }
}
