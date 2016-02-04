select u.id, u.name, substring(u.summary from 0 for 300), 'user' as type
from users u
where u.deleted_date is null
and name like :q

union
select c.id, c.name, substring(c.summary from 0 for 300), 'company' as type
from companies c
where c.deleted_date is null
and name like :q

union
select t.id, t."en-US" as name, '' as summary, 'tag' as type
from tags t
where t.deleted_date is null
and t.approved
and t."en-US" like :q

order by type
limit :limit
offset :offset
