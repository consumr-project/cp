select s.id,
    s.title,
    s.url,
    s.published_date,
    s.summary,
    s.created_date,
    s.created_by

from event_sources s

where s.created_by = :id
and s.deleted_date is null

order by s.created_date desc

limit 10
offset :offset

;
