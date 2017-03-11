with source as (
    -- sort of filter these summaries??
    select distinct es.event_id, es.summary
    from event_sources es
    where es.summary is not null
)

select distinct e.id as __id,
    e.deleted_date is not null as __deleted,
    e.created_date >= :since as __created,
    e.title as __label,

    string_agg(distinct lower(c.name), ', ') as companies,
    string_agg(distinct lower(t."en-US"), ', ') as tags,

    max(distinct s.summary) as summary,

    date,
    logo

from events e

left join event_tags et on (et.event_id = e.id)
left join tags t on (et.tag_id = t.id)

left join company_events ce on (ce.event_id = e.id)
left join companies c on (ce.company_id = c.id)

left join source s on (s.event_id = e.id)

where e.updated_date > :since

group by e.id;
