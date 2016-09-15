select e.id,
    0 as score,
    e.updated_date as updated_date,
    e.title,

    -- XXX this is returning duplicates
    -- http://stackoverflow.com/questions/30077639/distinct-on-in-an-aggregate-function-in-postgres
    -- http://stackoverflow.com/questions/12464037/two-sql-left-joins-produce-incorrect-result/12464135#12464135
    json_agg(json_build_object('id', t.id, 'label', t."en-US")) as tags,
    json_agg(json_build_object('id', c.id, 'label', c.name)) as companies

from company_followers cf

left join company_events ce on (ce.company_id = cf.company_id)
left join events e on (ce.event_id = e.id)

left join event_tags et on (et.event_id = e.id)
left join tags t on (et.tag_id = t.id)
left join companies c on (ce.company_id = c.id)

where cf.deleted_date is null
and cf.user_id = '89ebc4eb-99ec-4da9-94f1-63b54ad3e9d3'
and e.id is not null

group by e.id,
    e.title

order by updated_date desc

limit 5

;
