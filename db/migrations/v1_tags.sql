CREATE TABLE tags (
    id uuid NOT NULL,
    "en-US" character varying(255) NOT NULL,
    created_by character varying(255) NOT NULL,
    updated_by character varying(255) NOT NULL,
    deleted_by character varying(255),
    created_date timestamp with time zone NOT NULL,
    updated_date timestamp with time zone NOT NULL,
    deleted_date timestamp with time zone
);

ALTER TABLE ONLY tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);
