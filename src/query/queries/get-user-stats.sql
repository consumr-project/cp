with contributions as (
    select
        count(distinct c.id)::"numeric" as contributions_companies,
        count(distinct e.id)::"numeric" as contributions_events,
        count(distinct r.id)::"numeric" as contributions_reviews,
        count(distinct q.id)::"numeric" as contributions_questions,
        count(distinct r.id)::"numeric" as contributions_tags

    from users u

    left join companies c on (u.id = c.created_by and c.deleted_date is null)
    left join events e on (u.id = e.created_by and e.deleted_date is null)
    left join reviews r on (u.id = r.created_by and r.deleted_date is null)
    left join questions q on (u.id = q.created_by and q.deleted_date is null)
    left join tags t on (u.id = t.created_by and t.deleted_date is null)

    where u.id = :id

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

    where u.id = :id

    group by u.id
),

followers as (
    select
        count(distinct uf.f_user_id)::"numeric" as followers_users

    from users u

    left join user_followers uf on (u.id = uf.f_user_id and uf.deleted_date is null)

    where u.id = :id

    group by u.id
),

favorites as (
    select
        count(distinct eb.user_id)::"numeric" as favorites_events,
        count(distinct qv.user_id)::"numeric" as favorites_questions

    from users u

    left join event_bookmarks eb on (u.id = eb.user_id and eb.deleted_date is null)
    left join question_votes qv on (u.id = qv.user_id and qv.deleted_date is null)

    where u.id = :id

    group by u.id
)

select
    cn.contributions_companies + cn.contributions_events +
        cn.contributions_reviews + cn.contributions_questions +
        cn.contributions_tags as contributions,

    cn.contributions_companies,
    cn.contributions_events,
    cn.contributions_reviews,
    cn.contributions_questions,
    cn.contributions_tags,

    fg.following_companies + fg.following_tags + fg.following_users as following,
    fg.following_companies,
    fg.following_users,
    fg.following_tags,

    fr.followers_users as followers,
    fr.followers_users,

    fv.favorites_events + fv.favorites_questions as favorites,
    fv.favorites_questions,
    fv.favorites_events

from
    contributions cn,
    following fg,
    followers fr,
    favorites fv

;
