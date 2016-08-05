select eb.event_id as id,
    count(eb.event_id) as score,
    max(eb.updated_date) as updated_date,
    e.title,
    json_agg(json_build_object('id', t.id, 'label', t."en-US")) as tags,
    json_agg(json_build_object('id', c.id, 'label', c.name)) as companies

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

limit 5

;
