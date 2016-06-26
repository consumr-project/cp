select e.id

from events e

where e.created_by = :id
and e.deleted_date is null

order by e.created_date desc

limit 10
offset :offset

;
