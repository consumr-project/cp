select eb.event_id as id,
    count(eb.event_id) as score,
    max(eb.updated_date) as updated_date,
    e.title,

    -- XXX id and labels are being re-ordered by `distinct` and don't match up
    array_agg(distinct t.id) as tag_ids,
    array_agg(distinct t."en-US") as tag_labels,
    array_agg(distinct c.id) as company_ids,
    array_agg(distinct c.name) as company_labels

from event_bookmarks eb

left join events e on (eb.event_id = e.id)
left join event_tags et on (et.event_id = e.id)
left join tags t on (et.tag_id = t.id)
left join company_events ce on (ce.event_id = e.id)
left join companies c on (ce.company_id = c.id)

where eb.deleted_date is null

group by eb.event_id,
    e.title

order by score desc,
    updated_date desc

;
