select q.title,
    q.answer,
    q.created_date,

    coalesce(sum(qv.score), 0) as popular_score,

    u.id as user_id,
    u.name as user_name

from questions q

left join users u
    on (q.created_by = u.id)

left join question_votes qv
    on (q.id = qv.question_id and qv.deleted_date is null)

where q.approved
and q.deleted_date is null
and q.company_id = :company_id

group by q.id, u.id
order by popular_score

limit 50
offset :offset;
