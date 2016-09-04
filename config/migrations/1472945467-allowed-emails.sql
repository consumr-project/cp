create table if not exists allowed_emails (
    email varchar(100) not null,

    created_by uuid not null,
    created_date timestamp with time zone not null,

    updated_by uuid not null,
    updated_date timestamp with time zone not null default now(),

    deleted_by uuid not null,
    deleted_date timestamp with time zone not null,

    constraint allowed_emails_pkey
        primary key (email),

    constraint allowed_emails_created_by_fkey
        foreign key (created_by) references users(id)
            on update cascade,

    constraint allowed_emails_updated_by_fkey
        foreign key (updated_by) references users(id)
            on update cascade,

    constraint allowed_emails_deleted_by_fkey
        foreign key (deleted_by) references users(id)
            on update cascade
);
