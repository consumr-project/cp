select bei.email,

    bei.created_date::date,
    u_c.name created_by_name,
    u_c.email created_by_email,
    u_c.id created_by_id,

    bei.approved,
    bei.approved_date::date,
    u_a.name approved_by_name,
    u_a.email approved_by_email,
    u_a.id approved_by_id

from beta_email_invites bei

left join users u_c on (bei.created_by = u_c.id)
left join users u_a on (bei.approved_by = u_a.id)

where bei.deleted_date is null

order by bei.approved asc,
    bei.email

;
