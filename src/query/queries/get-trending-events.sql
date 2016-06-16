select eb.event_id as id,
    count(eb.event_id) as score,
    max(eb.updated_date) as updated_date

from event_bookmarks eb

where eb.deleted_date is null

group by eb.event_id

order by score desc, updated_date desc

;
