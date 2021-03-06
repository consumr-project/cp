select id, name, website_url, wikipedia_url, twitter_handle

from companies

where name is not null
and deleted_date is null
and (website_url is null
or wikipedia_url is null
or twitter_handle is null)

order by created_date desc
limit :limit

;
