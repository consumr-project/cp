create table if not exists tag_followers (
    tag_id uuid not null,
    user_id uuid not null,

    created_date timestamp with time zone not null,
    updated_date timestamp with time zone not null,
    deleted_date timestamp with time zone,

    constraint tag_followers_pkey
        primary key (tag_id, user_id),

    constraint tag_followers_tag_id_fkey
        foreign key (tag_id) references tags(id)
            on update cascade
            on delete cascade,

    constraint tag_followers_user_id_fkey
        foreign key (user_id) references users(id)
            on update cascade
            on delete cascade
);
