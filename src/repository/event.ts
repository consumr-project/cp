import { Event as IEvent, EventTag as IEventTag, EventSource as IEventSource, User as IUser } from 'cp/record';
import { Sequelize, Transaction, WhereOptions } from 'sequelize';
import { UUID, Date2 } from '../lang';
import { is_set } from '../utilities';
import { v4 } from 'node-uuid';
import { difference } from 'lodash';

import models from '../service/models';

/* const CompanyEvent = models.CompanyEvent; */
const Event = models.Event;
const EventSource = models.EventSource;
const EventTag = models.EventTag;

interface EventMessage extends IEvent {
    sources: any[];
    tags: any[];
    companies: any[];
}

interface EventSourceMessage {
    id?: string;
    event_id?: string;
    title: string;
    url: string;
    published_date: Date2;
    summary: string;
}

interface EventTagMessage {
    id: string;
}

function where(val: string, label: string = 'id'): WhereOptions {
    return { [label]: val, };
}

function get_sources_for_event(
    ev: IEvent,
    transaction: Transaction
): Promise<IEventSource[]> {
    return EventSource.findAll({
        transaction,
        paranoid: true,
        where: where(ev.id, 'event_id'),
    });
}

function upsert_event(
    raw_data: EventMessage,
    ev_data: IEvent,
    transaction: Transaction
): Promise<IEvent> {
    return !raw_data.id ?
        Event.create(ev_data, {
            transaction
        }) :
        Event.update(ev_data, {
            transaction,
            where: where(raw_data.id),
        }).then(() => ev_data);
}

function build_event_message(ev: IEvent, sources: IEventSource[], tag_ids: UUID[]): EventMessage {
    return {
        id: ev.id,
        title: ev.title,
        logo: ev.logo,
        date: ev.date,
        sources: sources.map(source => {
            return {
                id: source.id,
                title: source.title,
                url: source.url,
                published_date: source.published_date,
                summary: source.summary,
            };
        }),
        tags: tag_ids,
        companies: [],
    };
}

function build_event(data: EventMessage, user: IUser): IEvent {
    var ev: IEvent = {
        id: data.id,
        title: data.title,
        date: data.date,
        logo: data.logo,
        updated_by: user.id,
        updated_date: Date.now(),
    };

    if (!data.id) {
        ev.id = v4();
        ev.created_by = user.id;
        ev.created_date = Date.now();
    }

    return ev;
}

function build_event_source(ev: IEvent, source: IEventSource, user: IUser): IEventSource {
    var source: IEventSource = {
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

function build_event_tag(ev: IEvent, tag_id: string, user: IUser): IEventTag {
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

function get_tags_for_event(
    ev: IEvent,
    transaction: Transaction
): Promise<IEventTag[]> {
    return EventTag.findAll({
        transaction,
        paranoid: true,
        where: where(ev.id, 'event_id'),
    });
}

function set_event_tags(
    ev: IEvent,
    data: EventMessage,
    user: IUser,
    transaction: Transaction
): Promise<UUID[]> {
    return new Promise<UUID[]>((resolve, reject) => {
        get_tags_for_event(ev, transaction).then((tags: IEventTag[]) => {
            var cur_tag_ids = tags.filter(is_set).map(tag => tag.tag_id),
                msg_tag_ids = data.tags.filter(is_set).map(tag => tag.id),
                delete_ids = difference<string>(cur_tag_ids, msg_tag_ids),
                create_ids = difference<string>(msg_tag_ids, cur_tag_ids);

            // delete remove tags
            Promise.all(delete_ids.map(id => {
                return EventTag.destroy({
                    transaction,
                    where: where(id),
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

function set_event_sources(
    ev: IEvent,
    data: EventMessage,
    user: IUser,
    transaction: Transaction
): Promise<IEventSource[]> {
    return new Promise<IEventSource[]>((resolve, reject) => {
        get_sources_for_event(ev, transaction).then((sources: IEventSource[]) => {
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
    data: EventMessage,
    you: IUser
) {
    const ev_data = build_event(data, you);

    data.companies = data.companies || [];
    data.sources = data.sources || [];
    data.tags = data.tags || [];

    return new Promise<EventMessage>((resolve, reject) => {
        conn.transaction((transaction: Transaction) => {
            return upsert_event(data, ev_data, transaction).then((ev: IEvent) => {
                // get all active sources and figure out which ones need to be deleted and
                // upsert the reset
                return set_event_sources(ev, data, you, transaction).then(sources => {
                    return set_event_tags(ev, data, you, transaction).then(tag_ids => {
                        return build_event_message(ev, sources, tag_ids);
                    });
                });

                // get all active tags and figure out which ones need to be deleted and
                // upsert the reset

                // get all active company_events and figure out which ones need to be
                // deleted and upsert the reset
            });
        })
            .then(resolve)
            .catch(reject);
    });
}
