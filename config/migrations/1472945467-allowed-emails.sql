do $$
begin
    if not exists (
        select 1
        from information_schema.tables
        where table_name = 'beta_email_invites'
    ) then
        create table if not exists allowed_emails (
            email varchar(100) not null,

            created_by uuid not null,
            created_date timestamp with time zone not null,

            updated_by uuid not null,
            updated_date timestamp with time zone not null default now(),

            deleted_by uuid,
            deleted_date timestamp with time zone,

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
    end if;
end$$;
