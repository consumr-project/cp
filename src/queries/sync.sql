select <%= fields.join(', ') %> from <%= name %> where updated_date > :since;
