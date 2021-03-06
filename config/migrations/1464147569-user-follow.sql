create table if not exists user_followers (
    f_user_id uuid not null,
    user_id uuid not null,

    created_date timestamp with time zone not null,
    updated_date timestamp with time zone not null,
    deleted_date timestamp with time zone,

    constraint user_followers_pkey
        primary key (f_user_id, user_id),

    constraint user_followers_f_user_id_fkey
        foreign key (f_user_id) references users(id)
            on update cascade
            on delete cascade,

    constraint user_followers_user_id_fkey
        foreign key (user_id) references users(id)
            on update cascade
            on delete cascade
);
