select t.id,
    t."en-US" as label

from tag_followers tf

left join tags t on (t.id = tf.tag_id)

where tf.user_id = :id
and tf.deleted_date is null

order by tf.created_date desc

limit 10
offset :offset

;
