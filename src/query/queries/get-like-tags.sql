select id, "en-US" as label

from tags

<% var sfields = Object.keys(query).sort()
    .filter(function (p) { return /slist\d+/.test(p); }); %>
<% var ifields = Object.keys(query).sort()
    .filter(function (p) { return /ilist\d+/.test(p); }); %>

where to_tsvector("en-US") in
(<% sfields.forEach(function (f, i) { %>
<%= i ? ',' : '' %>to_tsvector(:<%= f %>)
<% }); %>)

<% ifields.forEach(function (f, i) { %>
or "en-US" ilike :<%= f %><% }); %>
