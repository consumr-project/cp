select e.id,
    e.title,
    e."date",

    count(distinct es.id)::"numeric" as source_count,
    count(eb.event_id)::"numeric" as bookmark_count

    -- distinct on (es.id) 8
    -- s.id
    -- es.id
    -- source 1 url
    -- source 1 date
    -- source 1 quote

from events e

left join event_bookmarks eb on (e.id = eb.event_id and eb.deleted_date is null)
left join event_sources es on (e.id = es.event_id and es.deleted_date is null)

-- left join (
--     select es.id,
--         es.event_id
--
--     from event_sources es
--
--     where es.deleted_date is null
--
--     limit 1
-- ) as s on (e.id = s.event_id)

-- where e.created_by = '4a9cb039-2a8c-458e-839f-78b4d951c226'
where e.created_by = :id
and e.deleted_date is null

-- group by e.id, es.id
-- order by es.id, es.created_date desc, e.created_date desc

group by e.id
order by e.created_date desc

;
