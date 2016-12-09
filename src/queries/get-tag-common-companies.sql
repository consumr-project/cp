select c.id,
    count(c.id) as amount,
    c.name as label

from companies c
left join company_events ce on (ce.company_id = c.id)
left join events e on (ce.event_id = e.id)
left join event_tags et on (et.event_id = e.id)

where et.tag_id = :tag_id
and et.deleted_date is null

group by c.id
order by amount desc

limit 50;

