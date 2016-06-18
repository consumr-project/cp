select count(*)::"numeric" as count,
    coalesce(avg(score)::"float8", 0) as average

from reviews
where company_id = :company_id
