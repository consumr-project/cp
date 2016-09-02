do $$
begin
    if not exists (
        select 1
        from information_schema.columns
        where table_name = 'tokens' and column_name = 'reason'
    ) then
        alter table tokens
        add column reason varchar(100) not null;
    end if;
end$$;
