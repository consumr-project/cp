do $$
begin
    if not exists (select 1 from pg_available_extensions where name = 'uuid-ossp') then
        create extension "uuid-ossp";
    end if;
end$$;
