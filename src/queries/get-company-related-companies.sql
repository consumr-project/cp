select c.id,
    count(c.id) as amount,
    c.name as label

from company_products cp
left join companies c on (c.id = cp.company_id)

where cp.company_id != :company_id
and cp.deleted_date is null
and cp.product_id in (
    select cp.product_id
    from company_products cp
    where cp.company_id = :company_id
)

group by c.id
order by amount desc
limit 50;
