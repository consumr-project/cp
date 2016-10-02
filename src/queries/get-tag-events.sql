select e.id,
    e.title,
    e.logo,
    e.date,
    count(distinct es.id)::"numeric" as source_count,
    count(distinct eb.user_id)::"numeric" as bookmark_count,

    <% if (query.user_id) { %>
    count(me.*) > 0 as bookmarked_by_user,
    <% } else { %>
    false as bookmarked_by_user,
    <% } %>

    array_agg(et.tag_id) as tag_ids

from event_tags et
left join events e on (e.id = et.event_id and e.deleted_date is null)
left join event_sources es on (e.id = es.event_id and es.deleted_date is null)
left join event_bookmarks eb on (e.id = eb.event_id and eb.deleted_date is null)

<% if (query.user_id) { %>
left join event_bookmarks me on (e.id = me.event_id
    and me.user_id = :user_id
    and me.deleted_date is null)
<% } %>

where et.tag_id = :tag_id
and et.deleted_date is null
and e.deleted_date is null

group by e.id
order by e.date desc

-- limit 25
-- offset -:-offset
