do $$
begin
    if not exists (select 1 from pg_type where typname = 'seq_users_member_number') then
        create sequence seq_users_member_number;
    end if;
end$$;


do $$
begin
    if not exists (
        select 1
        from information_schema.columns
        where table_name = 'users' and column_name = 'member_number'
    ) then
        alter table users
        add column member_number smallint not null default nextval('seq_users_member_number');
    end if;
end$$;
