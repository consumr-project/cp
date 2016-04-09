select r.id,
    r.score,
    r.title,
    r.summary,
    r.created_date,

    coalesce(sum(ru.score)::"numeric", 0) as usefulness_score,

    r.user_id,
    u.name as user_name,
    u.email as user_email,

    <% if (query.user_id) { %>
    count(ru_user.user_id) > 0 and min(ru_user.score) > 0 as user_useful_pos,
    count(ru_user.user_id) > 0 and max(ru_user.score) < 0 as user_useful_neg
    <% } else { %>
    false as user_useful_pos,
    false as user_useful_neg
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
