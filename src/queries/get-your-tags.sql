<% if (!auth.user.id) { %>
select 0 where false;
<% } else { %>
select distinct tf.tag_id as id, t."en-US" as label
from tag_followers tf
left join tags t on (tf.tag_id = t.id)
where tf.user_id = '<%= auth.user.id %>'
and tf.deleted_date is null
and t.deleted_date is null
order by label;
<% } %>
