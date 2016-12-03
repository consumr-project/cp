import { Tag, Company, Event } from './device/models';
import { logger } from './log';

const log = logger(__filename);

const URL_COMPANY_EVENT = /\/company\/.+\/event\/([a-zA-Z0-9\-]+)\/?/;
const URL_COMPANY_ID = /\/company\/id\/([a-zA-Z0-9\-]+)\/?/;
const URL_COMPANY_GUID = /\/company\/([a-zA-Z0-9\-]+)\/?/;
const URL_MODEL_THEN_ID = /\/(\w+)\/([a-zA-Z0-9\-]+)\/?/;

const TYPE_COMPANY = 'company';
const TYPE_EVENT = 'event';
const TYPE_TAG = 'tag';

export const OG: Unfurled = {
    description: 'consumr project, a crowd sourced platform to help us all learn a little bit more about the things we buy, sell, and consume every day.',
};

export interface BestGuess {
    model?: string;
    id?: string;
    guid?: string;
}

export interface Unfurled {
    title?: string;
    description?: string;
}

export function parse(url: string): BestGuess {
    var parts;

    if (parts = url.match(URL_COMPANY_EVENT)) {
        return { model: TYPE_EVENT, id: parts[1] };
    } else if (parts = url.match(URL_COMPANY_ID)) {
        return { model: TYPE_COMPANY, id: parts[1] };
    } else if (parts = url.match(URL_COMPANY_GUID)) {
        return { model: TYPE_COMPANY, guid: parts[1] };
    } else if (parts = url.match(URL_MODEL_THEN_ID)) {
        return { model: parts[1], id: parts[2] };
    } else {
        return {};
    }
}

export function unfurl<T>(url: string): Promise<Unfurled> {
    var info = parse(url);

    log.debug(url, info);

    if (info.model === TYPE_EVENT && info.id) {
        return Event.findById(info.id).then(ev => ({
            title: ev.title
        }));
    } else if (info.model === TYPE_COMPANY && info.guid) {
        return Company.findOne({ where: { guid: info.guid } }).then(company => ({
            title: company.name,
            description: company.summary
        }));
    } else if (info.model === TYPE_COMPANY && info.id) {
        return Company.findById(info.id).then(company => ({
            title: company.name,
            description: company.summary
        }));
    } else if (info.model === TYPE_TAG && info.id) {
        return Tag.findById(info.id).then(tag => ({
            title: tag['en-US']
        }));
    } else {
        return Promise.resolve(OG);
    }
}
