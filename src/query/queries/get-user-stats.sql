with contributions as (
    select
        count(distinct c.id)::"numeric" as contributions_companies,
        count(distinct e.id)::"numeric" as contributions_events

    from users u

    left join companies c on (u.id = c.created_by and c.deleted_date is null)
    left join events e on (u.id = e.created_by and e.deleted_date is null)

    -- where u.id = :user_id
    where u.id = '4a9cb039-2a8c-458e-839f-78b4d951c226'

    group by u.id
),

following as (
    select
        count(distinct cf.company_id)::"numeric" as following_companies,
        count(distinct tf.tag_id)::"numeric" as following_tags,
        count(distinct uf.user_id)::"numeric" as following_users

    from users u

    left join company_followers cf on (u.id = cf.user_id and cf.deleted_date is null)
    left join tag_followers tf on (u.id = tf.user_id and tf.deleted_date is null)
    left join user_followers uf on (u.id = uf.user_id and uf.deleted_date is null)

    -- where u.id = :user_id
    where u.id = '4a9cb039-2a8c-458e-839f-78b4d951c226'

    group by u.id
),

followers as (
    select
        count(distinct uf.f_user_id)::"numeric" as followers_users

    from users u

    left join user_followers uf on (u.id = uf.f_user_id and uf.deleted_date is null)

    -- where u.id = :user_id
    where u.id = '4a9cb039-2a8c-458e-839f-78b4d951c226'

    group by u.id
)

select
    cn.contributions_companies + cn.contributions_events as contributions,
    cn.contributions_companies,
    cn.contributions_events,

    fg.following_companies + fg.following_tags + fg.following_users as following,
    fg.following_companies,
    fg.following_users,
    fg.following_tags,

    fr.followers_users as followers,
    fr.followers_users

from
    contributions cn,
    following fg,
    followers fr

;
