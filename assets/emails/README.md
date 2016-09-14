### new emails

1. add a new template file in `assets/emails/` and follow this naming schema
for the file name: `[template_name].tmpl`.
2. add the email's subject to the `email.yml` strings file and follow this
naming schema for the key name: `[template_name]_subject`.
3. update the `EMAIL` variable in `message.ts`.
4. update the `TEMPLATES` variable in `email.ts`.
