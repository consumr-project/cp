select id, name

from companies

where name is not null
and (website_url is null
or wikipedia_url is null
or twitter_handle is null)

order by created_date desc;
