select distinct score,
    count(*)::"numeric" as score_count,

    count(*)::"float8" / (
        select count(*)
        from reviews
        where company_id = :company_id
    )::"float8" * 100.0 as score_percentage

from reviews
where company_id = :company_id

group by score
order by score
