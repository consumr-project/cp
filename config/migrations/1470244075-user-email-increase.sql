do $$
begin
    if not exists (
        select true
        from information_schema.columns
        where table_name = 'users'
        and column_name = 'email'
        and character_maximum_length = 255
    ) then
        alter table users
        alter column email type varchar(255);
    end if;
end$$;
