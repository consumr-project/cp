do $$
begin
    if not exists (select 1 from pg_type where typname = 'enum_users_lang') then
        create type enum_users_lang as ('en');
    end if;
end$$;


do $$
begin
    if not exists (select 1 from pg_type where typname = 'enum_users_role') then
        create type enum_users_role as ('admin', 'user');
    end if;
end$$;


create table if not exists users (
    id uuid not null,

    name varchar(100) not null,
    title varchar(100) not null,
    email varchar(100) not null,
    summary text,
    lang enum_users_lang,
    role enum_users_role,
    company_name varchar(100) not null,
    avatar_url varchar(100),
    linkedin_url varchar(100),

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
