import { AnyModel, Event, EventSource, User } from 'cp/record';
import { Sequelize, Transaction, WhereOptions } from 'sequelize';

interface EventMessage extends Event {
    sources: any[];
    tags: any[];
    companies: any[];
}

interface EventRequirements {
    CompanyEvent: AnyModel;
    Event: AnyModel;
    EventSource: AnyModel;
    EventTag: AnyModel;
}

export async function save_event(
    conn: Sequelize,
    models: EventRequirements,
    data: EventMessage,
    you: User
): Promise<Event> {
    /* const CompanyEvent = models.CompanyEvent; */
    const Event = models.Event;
    const EventSource = models.EventSource;
    /* const EventTag = models.EventTag; */

    var ev: Event;
    var sources: EventSource[];

    var transaction: Transaction = await conn.transaction();
    var now: number = Date.now();

    var where = (val: string, label: string = 'id'): WhereOptions => {
        return {
            [label]: val,
        };
    };

    var ev_data: Event = {
        id: data.id,
        title: data.title,
        date: data.date,
        logo: data.logo,
        updated_by: you.id,
        updated_date: now,
    };

    // save the main event and reference to the id
    if (!data.id) {
        ev_data.created_by = you.id;
        ev_data.created_date = now;
        ev = await Event.create(ev_data, { transaction });
    } else {
        ev = await Event.update(ev_data, {
            transaction,
            where: where(data.id),
        })[1][0];
    }

    if (!ev) {
        throw new Error('error creating event');
    }

    // get all active sources and figure out which ones need to be deleted and
    // upsert the reset
    sources = await EventSource.findAll({
        transaction,
        where: where(ev.id, 'event_id'),
    });

    /* console.log(sources); */

    // get all active tags and figure out which ones need to be deleted and
    // upsert the reset

    // get all active company_events and figure out which ones need to be
    // deleted and upsert the reset

    return ev;
}
