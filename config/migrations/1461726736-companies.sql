create table if not exists companies (
    id uuid not null,

    name character varying(50) not null,
    summary text,

    guid character varying(50),
    website_url character varying(255),
    wikipedia_url character varying(255),

    created_by uuid not null,
    updated_by uuid not null,
    deleted_by uuid,
    created_date timestamp with time zone not null,
    updated_date timestamp with time zone not null,
    deleted_date timestamp with time zone,

    constraint companies_pkey
        primary key (id),

    constraint companies_guid_key
        unique(guid)
);


create table if not exists company_followers (
    company_id uuid not null,
    user_id uuid not null,

    created_date timestamp with time zone not null,
    updated_date timestamp with time zone not null,
    deleted_date timestamp with time zone,

    constraint company_followers_pkey
        primary key (company_id, user_id),

    constraint company_followers_company_id_fkey
        foreign key (company_id) references companies(id)
            on update cascade
            on delete cascade,

    constraint company_followers_user_id_fkey
        foreign key (user_id) references users(id)
            on update cascade
            on delete cascade
);


create table if not exists company_events (
    company_id uuid not null,
    event_id uuid not null,
    created_date timestamp with time zone not null,
    updated_date timestamp with time zone not null,
    deleted_date timestamp with time zone,

    constraint company_events_pkey
        primary key (company_id, event_id),

    constraint company_events_company_id_fkey
        foreign key (company_id) references companies(id)
            on update cascade
            on delete cascade,

    constraint company_events_event_id_fkey
        foreign key (event_id) references events(id)
            on update cascade
            on delete cascade
);


create table if not exists company_products (
    company_id uuid not null,
    product_id uuid not null,
    created_date timestamp with time zone not null,
    updated_date timestamp with time zone not null,
    deleted_date timestamp with time zone,

    constraint company_products_pkey
        primary key (company_id, product_id),

    constraint company_products_company_id_fkey
        foreign key (company_id) references companies(id)
            on update cascade
            on delete cascade,

    constraint company_products_product_id_fkey
        foreign key (product_id) references products(id)
            on update cascade
            on delete cascade
);
