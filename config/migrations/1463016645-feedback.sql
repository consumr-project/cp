do $$
begin
    if not exists (select 1 from pg_type where typname = 'enum_feedback_type') then
        create type enum_feedback_type as enum ('question', 'suggestion', 'problem');
    end if;
end$$;


create table if not exists feedback (
    user_id uuid not null,

    type enum_feedback_type not null,
    referrer varchar(100) not null,
    message text not null,

    created_by uuid not null,
    updated_by uuid not null,
    deleted_by uuid,
    created_date timestamp with time zone not null,
    updated_date timestamp with time zone not null,
    deleted_date timestamp with time zone,

    constraint feeback_user_id_fkey
        foreign key (user_id) references users (id),

    constraint feedback_created_by_fkey
        foreign key (created_by) references users (id),

    constraint feedback_updated_by_fkey
        foreign key (updated_by) references users (id),

    constraint feedback_deleted_by_fkey
        foreign key (deleted_by) references users (id),

    constraint feedback_message_length_check
        check (length(message) < 1000)
);
