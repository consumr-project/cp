/// <reference path="../typings.d.ts"/>

'use strict';

import {Promise} from 'q';
import {Dictionary} from 'lodash';
import FirebaseRequest from './firebase_request';

export interface RequestPayload {
    index: String,
    query: String,
    type: String
}

export interface ResponsePayload {
    hits: {
        hits: Dictionary<{}>
    }
}

export default class Search extends FirebaseRequest<RequestPayload, ResponsePayload> {
    protected response_transformer = JSON.parse;
    search(index, type, query): Promise<ResponsePayload> {
        return this.exec({index, type, query});
    }
}
