import {Request, Response} from 'express';

import {map} from 'lodash';
import config = require('acm');
import request = require('request');

const CRUNCHBASE_ORG_URL = 'https://api.crunchbase.com/v/3/organizations';
const CRUNCHBASE_API_KEY = config('crunchbase.api.key');

interface CrunchBaseResponse {
    data: {
        items: Array<CrunchBaseOrganizationSummary>,
        paging: {}
    };
}

interface CrunchBaseOrganicationProperties extends CrunchBaseOrganizationSummary {}

interface CrunchBaseOrganizationSummary {
    uuid: string;
    type: string;
    properties: CrunchBaseOrganicationProperties
}

function flatten_company(company: CrunchBaseOrganizationSummary): CrunchBaseOrganicationProperties {
    company.properties.uuid = company.uuid;
    company.properties.type = company.type;
    return company.properties;
}

function handle_response(err: Error, res: Response, next: Function, body: string) {
    var parsed: CrunchBaseResponse;

    if (err) {
        next(err);
        return;
    }

    try {
        parsed = JSON.parse(body);
        res.json(<CPServiceResponseV1<CrunchBaseOrganicationProperties>>{
            body: map(parsed.data.items, flatten_company),
            meta: parsed.data.paging
        });
    } catch (ignore) {
        err = new Error('could not parse response');
        next(err);
        return;
    }
}

export function companies(req: Request, res: Response, next: Function) {
    let uri = CRUNCHBASE_ORG_URL,
        user_key = CRUNCHBASE_API_KEY;

    let query = req.query.q,
        page = req.query.page || 1;

    request({ uri, qs: { query, page, user_key } },
        (err, xres, body) =>
            handle_response(err, res, next, body));
}
