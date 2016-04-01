select r.id,
    r.score,
    r.title,
    r.summary,
    r.created_date,

    r.user_id,
    u.name as user_name,
    u.email as user_email,

    count(distinct ru.user_id) as usefulness_score,

    <% if (query.user_id) { %>
    count(ru_user.user_id) > 0 as already_found_useful
    <% } else { %>
    false as already_found_useful
    <% } %>

from reviews r

left join users u
    on (r.user_id = u.id)

left join review_usefulnesses as ru
    on (ru.review_id = r.id)

<% if (query.user_id) { %>
left join review_usefulnesses as ru_user
    on (ru_user.review_id = r.id and ru_user.user_id = :user_id)
<% } %>

where r.company_id = :company_id

group by r.id, u.id
order by r.created_date desc

limit 25
