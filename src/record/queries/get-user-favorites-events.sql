select eb.event_id as id

from event_bookmarks eb

where eb.user_id = :id
and eb.deleted_date is null

order by eb.created_date desc

limit 10
offset :offset

;
