do $$
begin
    if not exists (
        select 1
        from information_schema.columns
        where table_name = 'companies'
        and column_name = 'twitter_handle'
    ) then
        alter table companies
        add column twitter_handle character varying(50);
    end if;
end$$;
