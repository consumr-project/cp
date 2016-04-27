create table if not exists reviews (
    id uuid not null,
    user_id uuid not null,
    company_id uuid,

    score smallint not null,
    title character varying(100),
    summary text,

    created_by uuid not null,
    updated_by uuid not null,
    deleted_by uuid,
    created_date timestamp with time zone not null,
    updated_date timestamp with time zone not null,
    deleted_date timestamp with time zone,

    constraint reviews_pkey
        primary key (id),

    constraint reviews_company_id_fkey
        foreign key (company_id) references companies(id)
            on update cascade
            on delete set null,

    constraint reviews_user_id_fkey
        foreign key (user_id) references users(id)
            on update cascade
);


create table if not exists review_usefulnesses (
    review_id uuid not null,
    user_id uuid not null,
    score smallint,

    created_by uuid not null,
    updated_by uuid not null,
    deleted_by uuid,
    created_date timestamp with time zone not null,
    updated_date timestamp with time zone not null,
    deleted_date timestamp with time zone,

    constraint review_usefulnesses_pkey
        primary key (review_id, user_id),

    constraint review_usefulnesses_review_id_fkey
        foreign key (review_id) references reviews(id)
            on update cascade
            on delete cascade,

    constraint review_usefulnesses_user_id_fkey
        foreign key (user_id) references users(id)
            on update cascade
            on delete cascade
);


create table if not exists user_reports (
    id uuid not null,
    user_id uuid not null,
    review_id uuid,

    summary text,

    created_by uuid not null,
    updated_by uuid not null,
    deleted_by uuid,
    created_date timestamp with time zone not null,
    updated_date timestamp with time zone not null,
    deleted_date timestamp with time zone,

    constraint user_reports_pkey
        primary key (id),

    constraint user_reports_review_id_fkey
        foreign key (review_id) references reviews(id)
            on update cascade
            on delete set null,

    constraint user_reports_user_id_fkey
        foreign key (user_id) references users(id)
            on update cascade
);
