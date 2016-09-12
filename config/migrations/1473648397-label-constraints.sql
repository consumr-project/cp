do $$
begin
    if not exists (
        select 1
        from information_schema.constraint_column_usage
        where table_name = 'tags'
        and column_name = 'en-US'
        and constraint_name = 'tags_label_key'
    ) then
        alter table tags
        add constraint tags_label_key
            unique("en-US");
    end if;
end$$;

do $$
begin
    if not exists (
        select 1
        from information_schema.constraint_column_usage
        where table_name = 'products'
        and column_name = 'en-US'
        and constraint_name = 'products_label_key'
    ) then
        alter table products
        add constraint products_label_key
            unique("en-US");
    end if;
end$$;
