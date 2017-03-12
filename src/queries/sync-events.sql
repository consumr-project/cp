with source as (
    select distinct on (es.event_id)
        es.event_id,
        es.url,
        substring(es.summary from 0 for 300) as summary

    from event_sources es
    where es.summary is not null
    and es.deleted_date is null
),

company as (
    select distinct on (ce.event_id)
        ce.event_id, ce.company_id

    from company_events ce
    where ce.deleted_date is null
)

select distinct on (e.id)
    e.id as __id,
    e.deleted_date is not null as __deleted,
    e.created_date >= :since as __created,
    e.title as __label,

    string_agg(distinct lower(c.name), ', ') as companies,
    string_agg(distinct lower(t."en-US"), ', ') as tags,

    cc.company_id,
    max(distinct s.summary) as summary,
    max(distinct s.url) as url,

    date,
    logo

from events e

left join event_tags et on (et.event_id = e.id and et.deleted_date is null)
left join tags t on (et.tag_id = t.id and t.deleted_date is null)

left join company_events ce on (ce.event_id = e.id and ce.deleted_date is null)
left join companies c on (ce.company_id = c.id and c.deleted_date is null)

left join source s on (s.event_id = e.id)
left join company cc on (cc.event_id = e.id)

where e.updated_date > :since

group by e.id, cc.company_id;
