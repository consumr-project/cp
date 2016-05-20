select t.id,
    count(t.id) as amount,
    t."en-US" as label

from tags t

-- where t.id = :tag_id
where t.id = '322074d2-fab9-4021-935a-955e3882c731'

group by t.id
order by amount desc

limit 50;
