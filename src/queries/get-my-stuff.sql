-- your stuff: any events that has been added to pages you follow or by people
-- you follow
with users as (
    select f_user_id as id
    from user_followers
    where deleted_date is null
    -- and user_id = "<%= auth.user.id %>"
    and user_id = '4a9cb039-2a8c-458e-839f-78b4d951c226'
    or user_id = '89ebc4eb-99ec-4da9-94f1-63b54ad3e9d3'

    -- XXX for testing one
    union select '4a9cb039-2a8c-458e-839f-78b4d951c226'
    union select '89ebc4eb-99ec-4da9-94f1-63b54ad3e9d3'
),

companies as (
    select company_id as id
    from company_followers
    where deleted_date is null
    -- and user_id = "<%= auth.user.id %>"
    and user_id = '4a9cb039-2a8c-458e-839f-78b4d951c226'
    or user_id = '89ebc4eb-99ec-4da9-94f1-63b54ad3e9d3'
),

tags as (
    select tag_id as id
    from tag_followers
    where deleted_date is null
    -- and user_id = "<%= auth.user.id %>"
    and user_id = '4a9cb039-2a8c-458e-839f-78b4d951c226'
    or user_id = '89ebc4eb-99ec-4da9-94f1-63b54ad3e9d3'
)

select distinct e.id,
    e.title,
    e.created_date

from events e, users u, companies c, tags t

where e.deleted_date is null
-- and e.created_by != "<%= auth.user.id %>"
and e.created_by != '1a9cb039-2a8c-458e-839f-78b4d951c226'
and (
    -- created by people I follow
    e.created_by in (u.id)

    -- added to a company I follow
    or false

    -- added to a tag I follow
    or false
)

order by e.created_date desc

;
