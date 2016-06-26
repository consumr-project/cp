select q.id,
    q.title,
    q.company_id,
    coalesce(substring(q.answer from '^.+\n'), '') as answer,
    q.created_date

from questions q

where q.created_by = :id
and q.deleted_date is null

order by q.created_date desc

limit 10
offset :offset

;
