do $$
begin
    if exists (
        select 1
        from information_schema.columns
        where table_name = 'events' and column_name = 'sentiment'
    ) then
        alter table events
        drop column sentiment;
    end if;
end$$;
