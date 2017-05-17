select u.id, u.name, substring(u.summary from 0 for 300) as summary, 'user' as type
from users u
where u.deleted_date is null
and name ilike :q

union
select c.id, c.name, substring(c.summary from 0 for 300) as summary, 'company' as type
from companies c
where c.deleted_date is null
and name ilike :q

union
select e.id, e.title as name, '' as summary, 'event' as type
from events e
where e.deleted_date is null
and title ilike :q

union
select t.id, t."en-US" as name, '' as summary, 'tag' as type
from tags t
where t.deleted_date is null
and t.approved
and t."en-US" ilike :q

order by type
limit :limit
offset :offset
