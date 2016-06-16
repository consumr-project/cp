select eb.event_id as id,
    count(eb.event_id) as score,
    max(eb.updated_date) as updated_date,
    e.title,

    array_agg(t.id) as tag_ids,
    array_agg(t."en-US") as tag_labels

from event_bookmarks eb

left join events e on (eb.event_id = e.id)
left join event_tags et on (et.event_id = e.id)
left join tags t on (et.tag_id = t.id)

where eb.deleted_date is null

group by eb.event_id,
    e.title

order by score desc,
    updated_date desc

;
