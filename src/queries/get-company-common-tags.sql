select tag_id as id,
    count(tag_id) as amount,
    tags."en-US" as label

from event_tags et
left join tags on (tags.id = tag_id)

where et.deleted_date is null
and event_id in (
    select event_id
    from company_events
    where company_id = :company_id
)

group by tag_id, label
order by amount desc
limit 50;
