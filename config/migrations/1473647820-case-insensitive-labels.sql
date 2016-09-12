do $$
begin
    if exists (
        select 1
        from information_schema.columns
        where column_name = 'en-US'
        and table_name = 'tags'
        and data_type = 'character varying'
    ) then
        alter table tags
        alter column "en-US" type citext;
    end if;
end$$;

do $$
begin
    if exists (
        select 1
        from information_schema.columns
        where column_name = 'en-US'
        and table_name = 'products'
        and data_type = 'character varying'
    ) then
        alter table products
        alter column "en-US" type citext;
    end if;
end$$;
