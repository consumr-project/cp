select c.id,
    c.guid,
    c.name,
    c.website_url,
    coalesce(substring(c.summary from '^.+\n'), '') as summary

from companies c

where c.created_by = :id
and c.deleted_date is null

order by c.created_date desc

limit 10
offset :offset

;
