select e.id,
    e.title,
    e."date",

    count(distinct es.id)::"numeric" as source_count,
    count(eb.event_id)::"numeric" as bookmark_count,

    s.url as source_url,
    s.published_date as source_publised_date,
    s.summary as source_summary

from events e

left join event_bookmarks eb on (e.id = eb.event_id and eb.deleted_date is null)
left join event_sources es on (e.id = es.event_id and es.deleted_date is null)

left join (
    select es.event_id,
        es.url,
        es.published_date,
        es.summary

    from event_sources es
    where es.deleted_date is null
    limit 1
) as s on (e.id = s.event_id)

where e.created_by = :id
and e.deleted_date is null

group by e.id, s.event_id, s.url, s.published_date, s.summary
order by e.created_date desc

;
