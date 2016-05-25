with stats as (
    select u.id as user_id,
        count(distinct c.id)::"numeric" as contributions_companies,
        count(distinct e.id)::"numeric" as contributions_events,
        count(distinct r.id)::"numeric" as contributions_reviews,
        count(distinct q.id)::"numeric" as contributions_questions,
        count(distinct r.id)::"numeric" as contributions_tags,
        count(distinct cf.company_id)::"numeric" as following_companies,
        count(distinct tf.tag_id)::"numeric" as following_tags,
        count(distinct uf1.user_id)::"numeric" as following_users,
        count(distinct uf2.f_user_id)::"numeric" as followers_users,
        count(distinct eb.user_id)::"numeric" as favorites_events,
        count(distinct qv.user_id)::"numeric" as favorites_questions

    from users u

    left join companies c on (u.id = c.created_by and c.deleted_date is null)
    left join events e on (u.id = e.created_by and e.deleted_date is null)
    left join reviews r on (u.id = r.created_by and r.deleted_date is null)
    left join questions q on (u.id = q.created_by and q.deleted_date is null)
    left join tags t on (u.id = t.created_by and t.deleted_date is null)
    left join company_followers cf on (u.id = cf.user_id and cf.deleted_date is null)
    left join tag_followers tf on (u.id = tf.user_id and tf.deleted_date is null)
    left join user_followers uf1 on (u.id = uf1.user_id and uf1.deleted_date is null)
    left join user_followers uf2 on (u.id = uf2.f_user_id and uf2.deleted_date is null)
    left join event_bookmarks eb on (u.id = eb.user_id and eb.deleted_date is null)
    left join question_votes qv on (u.id = qv.user_id and qv.deleted_date is null)

    where u.id = :id
    group by u.id
)

select user_id,

    contributions_companies + contributions_events +
        contributions_reviews + contributions_questions +
        contributions_tags as contributions,

    contributions_companies,
    contributions_events,
    contributions_reviews,
    contributions_questions,
    contributions_tags,

    following_companies + following_tags + following_users as following,
    following_companies,
    following_users,
    following_tags,

    followers_users as followers,
    followers_users,

    favorites_events + favorites_questions as favorites,
    favorites_questions,
    favorites_events

from stats;
