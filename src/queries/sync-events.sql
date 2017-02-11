select e.id as __id,
    e.deleted_date is not null as __deleted,
    e.created_date >= :since as __created,
    e.title as __label,
    string_agg(t."en-US", ', ') as tags

from events e

left join event_tags et on (et.event_id = e.id)
left join tags t on (et.tag_id = t.id)

where e.updated_date > :since

group by e.id;
