create table if not exists tokens (
    id uuid not null,

    token character varying(100) not null,
    used boolean default false,
    used_date timestamp with time zone,
    expiration_date timestamp with time zone,

    created_by uuid not null,
    updated_by uuid not null,
    deleted_by uuid,
    created_date timestamp with time zone not null,
    updated_date timestamp with time zone not null,
    deleted_date timestamp with time zone,

    constraint tokens_created_by_fkey
        foreign key (created_by) references users(id),

    constraint tokens_updated_by_fkey
        foreign key (updated_by) references users(id),

    constraint tokens_deleted_by_fkey
        foreign key (deleted_by) references users(id),

    constraint tokens_token_key
        unique(token)
);
