select r.id,
    r.user_id,
    r.title,
    r.summary,
    r.score,
    r.created_date,

    u.name as user_name,
    u.email as user_email

from reviews r

left join users u on (u.id = r.user_id)

where r.user_id = :id
and r.deleted_date is null

limit 50
offset :offset

;
