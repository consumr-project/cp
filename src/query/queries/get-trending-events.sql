select eb.event_id as id,
    count(eb.event_id) as score,
    max(eb.updated_date) as updated_date,
    e.title

from event_bookmarks eb

left join events e on (eb.event_id = e.id)

where eb.deleted_date is null

group by eb.event_id,
    e.title

order by score desc,
    updated_date desc

;
