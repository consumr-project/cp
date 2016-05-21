select t.id,
    count(t.id) as amount,
    t."en-US" as label

from event_tags et
left join tags t on (t.id = et.tag_id)

where et.tag_id != :tag_id
and et.event_id in (
    select et.event_id
    from event_tags et
    where et.tag_id = :tag_id
)

group by t.id
order by amount desc
limit 50;
