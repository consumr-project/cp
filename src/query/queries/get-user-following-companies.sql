select c.id,
    c.guid,
    c.name,
    c.website_url,
    coalesce(substring(c.summary from '^.+\n'), '') as summary

from company_followers cf

left join companies c on (c.id = cf.company_id)

where cf.user_id = :id
and cf.deleted_date is null

order by cf.created_date desc

limit 10
offset :offset

;
