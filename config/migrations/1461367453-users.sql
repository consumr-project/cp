do $$
begin
    if not exists (select 1 from pg_type where typname = 'enum_users_lang') then
        create type enum_users_lang as enum ('en');
    end if;
end$$;


do $$
begin
    if not exists (select 1 from pg_type where typname = 'enum_users_role') then
        create type enum_users_role as enum ('user', 'admin');
    end if;
end$$;


create table if not exists users (
    id uuid not null,

    name varchar(100) not null,
    title varchar(100),
    email varchar(100) not null,
    summary text,
    lang enum_users_lang not null default 'en',
    role enum_users_role not null default 'user',
    company_name varchar(100),
    avatar_url varchar(255),
    linkedin_url varchar(255),

    auth_linkedin_id varchar(100),
    auth_apikey varchar(100),
    last_login_date timestamp with time zone,

    created_by uuid not null,
    updated_by uuid not null,
    deleted_by uuid,
    created_date timestamp with time zone not null,
    updated_date timestamp with time zone not null,
    deleted_date timestamp with time zone,

    constraint users_pkey
        primary key (id)
);
