select * from (
-- any events that has been added to pages you follow
select e.id,
    0 as score,
    e.created_date as updated_date,
    e.title

from company_followers cf

left join company_events ce on (cf.company_id = ce.company_id)
left join events e on (ce.event_id = e.id)
left join companies c on (ce.company_id = c.id)
left join event_tags et on (e.id = et.event_id)
left join tags t on (et.tag_id = t.id)

-- where cf.user_id = '<%= auth.user.id %>'
where cf.user_id = '4a9cb039-2a8c-458e-839f-78b4d951c226'
and cf.deleted_date is null
and e.deleted_date is null

union

-- any events that has been added by people you follow
select e.id,
    0 as score,
    e.created_date as updated_date,
    e.title

from user_followers uf

left join events e on (e.created_by = uf.f_user_id or e.updated_by = uf.f_user_id)
left join company_events ce on (ce.event_id = e.id)
left join companies c on (c.id = ce.company_id)
left join event_tags et on (e.id = et.event_id)
left join tags t on (et.tag_id = t.id)

-- where uf.user_id = '<%= auth.user.id %>'
where uf.user_id = '4a9cb039-2a8c-458e-839f-78b4d951c226'
and uf.deleted_date is null
and e.deleted_date is null
) ss

group by id

-- order by updated_date desc

-- limit 5

;
