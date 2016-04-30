create table if not exists questions (
    id uuid not null,
    company_id uuid not null,

    title text,
    answer text,
    answered_by uuid,
    answered_date timestamp with time zone,

    approved boolean default false,
    approved_by uuid,
    approved_date timestamp with time zone,

    created_by uuid not null,
    updated_by uuid not null,
    deleted_by uuid,
    created_date timestamp with time zone not null,
    updated_date timestamp with time zone not null,
    deleted_date timestamp with time zone,

    constraint questions_pkey
        primary key (id),

    constraint questions_company_id_fkey
        foreign key (company_id) references companies(id)
            on update cascade
            on delete set null,

    constraint questions_answered_by_fkey
        foreign key (answered_by) references users(id),

    constraint questions_approved_by_fkey
        foreign key (approved_by) references users(id),

    constraint questions_created_by_fkey
        foreign key (approved_by) references users(id),

    constraint questions_updated_by_fkey
        foreign key (approved_by) references users(id),

    constraint questions_deleted_by_fkey
        foreign key (approved_by) references users(id),

    constraint questions_title_length_check
        check (length(title) < 500),

    constraint questions_answer_length_check
        check (length(title) < 5000)
);


create table if not exists question_votes (
    question_id uuid not null,
    user_id uuid not null,

    score smallint not null default 0,

    created_by uuid not null,
    updated_by uuid not null,
    deleted_by uuid,
    created_date timestamp with time zone not null,
    updated_date timestamp with time zone not null,
    deleted_date timestamp with time zone,

    constraint question_votes_pkey
        primary key (question_id, user_id),

    constraint question_votes_question_id_fkey
        foreign key (question_id) references questions (id),

    constraint question_votes_user_id_fkey
        foreign key (user_id) references users (id),

    constraint question_votes_created_by_fkey
        foreign key (created_by) references users (id),

    constraint question_votes_updated_by_fkey
        foreign key (updated_by) references users (id),

    constraint question_votes_deleted_by_fkey
        foreign key (deleted_by) references users (id),

    constraint question_votes_score_min_max_check
        check (score between -1 and 1)
);
