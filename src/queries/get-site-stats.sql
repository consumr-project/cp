with

companies as (
    select count(*) as companies
    from companies
    where companies.deleted_date is null
),

users as (
    select count(*) as users
    from users
    where users.deleted_date is null
),

events as (
    select count(*) as events
    from events
    where events.deleted_date is null
),

tags as (
    select count(*) as tags
    from tags
    where tags.deleted_date is null
),

reviews as (
    select count(*) as reviews
    from reviews
    where reviews.deleted_date is null
)

select *
from companies, users, events, tags, reviews

;
