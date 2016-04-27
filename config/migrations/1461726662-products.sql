create table if not exists products (
    id uuid not null,

    approved boolean default false not null,
    "en-us" character varying(50) not null,

    created_by uuid not null,
    updated_by uuid not null,
    deleted_by uuid,
    created_date timestamp with time zone not null,
    updated_date timestamp with time zone not null,
    deleted_date timestamp with time zone,

    constraint products_pkey
        primary key (id)
);
