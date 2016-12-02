import { Sequelize, Transaction, WhereOptions } from 'sequelize';
import { UUID } from '../lang';
import { is_set } from '../utilities';
import { v4 } from 'node-uuid';
import { difference } from 'lodash';

import { UserMessage } from '../record/models/user';
import { EventMessage } from '../record/models/event';
import { EventSourceMessage } from '../record/models/event_source';
import { EventTagMessage } from '../record/models/event_tag';
import { CompanyEventMessage } from '../record/models/company_event';

import { CompanyEvent, EventSource, EventTag, Event } from '../device/models';

interface EventClientPayload extends EventMessage {
    _force_create?: boolean;
    sources: any[];
    tags: any[];
    companies: any[];
}

function where(val: string, label: string = 'id'): WhereOptions {
    return { [label]: val, };
}

function get_sources_for_event(
    ev: EventMessage,
    transaction: Transaction
): Promise<EventSourceMessage[]> {
    return EventSource.findAll({
        transaction,
        paranoid: true,
        where: where(ev.id, 'event_id'),
    });
}

function upsert_event(
    raw_data: EventClientPayload,
    ev_data: EventMessage,
    transaction: Transaction
): Promise<EventMessage> {
    return !raw_data.id || raw_data._force_create ?
        Event.create(ev_data, {
            transaction
        }) :
        Event.update(ev_data, {
            transaction,
            where: where(raw_data.id),
        }).then(() => ev_data);
}

function build_event_message(ev: EventMessage, sources: EventSourceMessage[], tag_ids: UUID[], company_ids: UUID[]): EventClientPayload {
    return {
        id: ev.id,
        title: ev.title,
        logo: ev.logo,
        date: ev.date,
        tags: tag_ids,
        companies: company_ids,
        sources: sources.map(source => {
            return {
                id: source.id,
                title: source.title,
                url: source.url,
                published_date: source.published_date,
                summary: source.summary,
            };
        }),
    };
}

function build_event(data: EventClientPayload, user: UserMessage): EventMessage {
    var ev: EventMessage = {
        id: data.id,
        title: data.title,
        date: data.date,
        logo: data.logo,
        updated_by: user.id,
        updated_date: Date.now(),
    };

    if (!data.id || data._force_create) {
        ev.id = data.id || v4();
        ev.created_by = user.id;
        ev.created_date = Date.now();
    }

    return ev;
}

function build_event_source(ev: EventMessage, source: EventSourceMessage, user: UserMessage): EventSourceMessage {
    var source: EventSourceMessage = {
        id: source.id,
        event_id: ev.id,
        title: source.title,
        url: source.url,
        published_date: source.published_date,
        summary: source.summary,
        updated_by: user.id,
        updated_date: Date.now(),
    };

    if (!source.id) {
        source.id = v4();
        source.created_by = user.id;
        source.created_date = Date.now();
    }

    return source;
}

function build_event_company(ev: EventMessage, company_id: string, user: UserMessage): CompanyEventMessage {
    return {
        id: v4(),
        event_id: ev.id,
        company_id: company_id,
        created_by: user.id,
        created_date: Date.now(),
        updated_by: user.id,
        updated_date: Date.now(),
    };
}

function build_event_tag(ev: EventMessage, tag_id: string, user: UserMessage): EventTagMessage {
    return {
        id: v4(),
        event_id: ev.id,
        tag_id: tag_id,
        created_by: user.id,
        created_date: Date.now(),
        updated_by: user.id,
        updated_date: Date.now(),
    };
}

function get_companies_for_event(
    ev: EventMessage,
    transaction: Transaction
): Promise<CompanyEventMessage[]> {
    return CompanyEvent.findAll({
        transaction,
        paranoid: true,
        where: where(ev.id, 'event_id'),
    });
}

function get_tags_for_event(
    ev: EventMessage,
    transaction: Transaction
): Promise<EventTagMessage[]> {
    return EventTag.findAll({
        transaction,
        paranoid: true,
        where: where(ev.id, 'event_id'),
    });
}

function set_event_tags(
    ev: EventMessage,
    data: EventClientPayload,
    user: UserMessage,
    transaction: Transaction
): Promise<UUID[]> {
    return new Promise<UUID[]>((resolve, reject) => {
        get_tags_for_event(ev, transaction).then((tags: EventTagMessage[]) => {
            var cur_tag_ids = tags.filter(is_set).map(tag => tag.tag_id),
                msg_tag_ids = data.tags.filter(is_set).map(tag => tag.id),
                delete_ids = difference<string>(cur_tag_ids, msg_tag_ids),
                create_ids = difference<string>(msg_tag_ids, cur_tag_ids);

            // delete remove tags
            Promise.all(delete_ids.map(id => {
                return EventTag.destroy({
                    transaction,
                    where: {
                        event_id: ev.id,
                        tag_id: id,
                    },
                });
            })).then(() => {
                // upsert the rest
                Promise.all(create_ids.map(id => {
                    return EventTag.create(build_event_tag(ev, id, user), {
                        transaction
                    }).then(() => id);
                }))
                    .then(tags => resolve(tags))
                    .catch(reject);
            }).catch(reject);
        });
    });
}

function set_event_companies(
    ev: EventMessage,
    data: EventClientPayload,
    user: UserMessage,
    transaction: Transaction
): Promise<UUID[]> {
    return new Promise<UUID[]>((resolve, reject) => {
        get_companies_for_event(ev, transaction).then((companies: CompanyEventMessage[]) => {
            var cur_company_ids = companies.filter(is_set).map(company => company.company_id),
                msg_company_ids = data.companies.filter(is_set).map(company => company.id),
                delete_ids = difference<string>(cur_company_ids, msg_company_ids),
                create_ids = difference<string>(msg_company_ids, cur_company_ids);

            // delete remove companies
            Promise.all(delete_ids.map(id => {
                return CompanyEvent.destroy({
                    transaction,
                    where: {
                        event_id: ev.id,
                        company_id: id,
                    },
                });
            })).then(() => {
                // upsert the rest
                Promise.all(create_ids.map(id => {
                    return CompanyEvent.create(build_event_company(ev, id, user), {
                        transaction
                    }).then(() => id);
                }))
                    .then(companies => resolve(companies))
                    .catch(reject);
            }).catch(reject);
        });
    });
}

function set_event_sources(
    ev: EventMessage,
    data: EventClientPayload,
    user: UserMessage,
    transaction: Transaction
): Promise<EventSourceMessage[]> {
    return new Promise<EventSourceMessage[]>((resolve, reject) => {
        get_sources_for_event(ev, transaction).then((sources: EventSourceMessage[]) => {
            var cur_source_ids = sources.filter(is_set).map(source => source.id),
                msg_source_ids = data.sources.filter(is_set).map(source => source.id),
                delete_ids = difference<string>(cur_source_ids, msg_source_ids);

            // delete remove sources
            Promise.all(delete_ids.map(id => {
                return EventSource.destroy({
                    transaction,
                    where: where(id),
                });
            })).then(() => {
                // upsert the rest
                Promise.all(data.sources.map(source => {
                    var source_data = build_event_source(ev, source, user);
                    return !source.id ?
                        EventSource.create(source_data, {
                            transaction
                        }).then(() => source_data) :
                        EventSource.update(source_data, {
                            transaction,
                            where: where(source_data.id)
                        }).then(() => source_data);
                }))
                    .then(sources => resolve(sources))
                    .catch(reject);
            }).catch(reject);
        });
    });
}

export function save_event(
    conn: Sequelize,
    data: EventClientPayload,
    you: UserMessage
) {
    const ev_data = build_event(data, you);

    data.companies = data.companies || [];
    data.sources = data.sources || [];
    data.tags = data.tags || [];

    return new Promise<EventMessage>((resolve, reject) => {
        conn.transaction((transaction: Transaction) => {
            return upsert_event(data, ev_data, transaction).then((ev: EventMessage) => {
                // get all active sources and figure out which ones need to be deleted and
                // upsert the reset
                return set_event_sources(ev, data, you, transaction).then(sources => {
                    // get all active tags and figure out which ones need to be deleted and
                    // upsert the reset
                    return set_event_tags(ev, data, you, transaction).then(tag_ids => {
                        // get all active company_events and figure out which ones need to be
                        // deleted and upsert the reset
                        return set_event_companies(ev, data, you, transaction).then(company_ids => {
                            return build_event_message(ev, sources, tag_ids, company_ids);
                        });
                    });
                });
            });
        })
            .then(resolve)
            .catch(reject);
    });
}
