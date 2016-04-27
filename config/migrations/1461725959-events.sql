do $$
begin
    if not exists (select 1 from pg_type where typname = 'enum_events_sentiment') then
        create type enum_events_sentiment as enum ('positive', 'negative', 'neutral');
    end if;
end$$;


create table if not exists events (
    id uuid not null,

    title character varying(100) not null,
    sentiment enum_events_sentiment not null,
    date timestamp with time zone,

    logo character varying(50),

    created_by uuid not null,
    updated_by uuid not null,
    deleted_by uuid,
    created_date timestamp with time zone not null,
    updated_date timestamp with time zone not null,
    deleted_date timestamp with time zone,

    constraint events_pkey
        primary key (id)
);


create table if not exists event_bookmarks (
    event_id uuid not null,
    user_id uuid not null,
    created_date timestamp with time zone not null,
    updated_date timestamp with time zone not null,
    deleted_date timestamp with time zone

    constraint event_bookmarks_pkey
        primary key (event_id, user_id),

    constraint event_bookmarks_event_id_fkey
        foreign key (event_id) references events(id)
            on update cascade
            on delete cascade,

    constraint event_bookmarks_user_id_fkey
        foreign key (user_id) references users(id)
            on update cascade
            on delete cascade
);


create table if not exists event_sources (
    id uuid not null,
    event_id uuid,

    title character varying(100),
    url character varying(60) not null,
    published_date timestamp with time zone not null,
    summary text,

    created_by uuid not null,
    updated_by uuid not null,
    deleted_by uuid,
    created_date timestamp with time zone not null,
    updated_date timestamp with time zone not null,
    deleted_date timestamp with time zone,

    constraint event_sources_pkey
        primary key (id),

    constraint event_sources_event_id_fkey
        foreign key (event_id) references events(id)
            on update cascade
            on delete set null
);


create table if not exists event_tags (
    event_id uuid not null,
    tag_id uuid not null,

    created_date timestamp with time zone not null,
    updated_date timestamp with time zone not null,
    deleted_date timestamp with time zone,

    constraint event_tags_pkey
        primary key (event_id, tag_id),

    constraint event_tags_event_id_fkey
        foreign key (event_id) references events(id)
            on update cascade
            on delete cascade,

    constraint event_tags_tag_id_fkey
        foreign key (tag_id) references tags(id)
            on update cascade
            on delete cascade
);


create table if not exists company_events (
    company_id uuid not null,
    event_id uuid not null,
    created_date timestamp with time zone not null,
    updated_date timestamp with time zone not null,
    deleted_date timestamp with time zone

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
