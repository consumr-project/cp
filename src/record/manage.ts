import { AnyModel, Event, User } from 'cp/record';
import { Sequelize, Transaction, WhereOptions } from 'sequelize';

interface EventMessage extends Event {
    sources: any[];
    tags: any[];
    companies: any[];
}

interface EventRequirements {
    Event: AnyModel;
}

export async function save_event(
    conn: Sequelize,
    models: EventRequirements,
    data: EventMessage,
    you: User
): Promise<Event> {
    var now: number,
        ev: Event,
        ev_data: Event,
        transaction: Transaction,
        where: WhereOptions;

    transaction = await conn.transaction();
    now = Date.now();

    where = {
        id: data.id,
    };

    ev_data = {
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
        ev = await models.Event.create(ev_data, { transaction });
    } else {
        ev = await models.Event.update(ev_data, {
            transaction,
            where,
        })[1][0];
    }

    if (!ev) {
        throw new Error('error creating event');
    }

    return ev;

    // get all active sources and figure out which sources need to be
    // deleted and upsert the reset

    // get all active tags and figure out which sources need to be
    // deleted and upsert the reset

    // get all active company_events and figure out which sources need
    // to be deleted and upsert the reset
}
