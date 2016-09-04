do $$
begin
    if exists (
        select 1
        from information_schema.tables
        where table_name = 'allowed_emails'
    ) then
        alter table allowed_emails
        rename to beta_email_invites;
    end if;
end$$;

do $$
begin
    if not exists (
        select 1
        from information_schema.columns
        where table_name = 'beta_email_invites'
        and column_name = 'approved'
    ) then
        alter table beta_email_invites
        add column approved boolean default false,
        add column approved_by uuid,
        add column approved_date timestamp with time zone,
        add constraint beta_email_invites_approved_by_fkey
            foreign key (approved_by) references users(id);
    end if;
end$$;
