--
-- events
--
CREATE TABLE events (
    id uuid NOT NULL,
    company_id character varying(255) NOT NULL,
    title character varying(255) NOT NULL,
    sentiment enum_events_sentiment NOT NULL,
    created_by character varying(255) NOT NULL,
    updated_by character varying(255) NOT NULL,
    deleted_by character varying(255),
    created_date timestamp with time zone NOT NULL,
    updated_date timestamp with time zone NOT NULL,
    deleted_date timestamp with time zone
);

ALTER TABLE ONLY events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);

--
-- sources
--
CREATE TABLE sources (
    id uuid NOT NULL,
    title character varying(255),
    url character varying(255) NOT NULL,
    published_date timestamp with time zone NOT NULL,
    created_by character varying(255) NOT NULL,
    updated_by character varying(255) NOT NULL,
    deleted_by character varying(255),
    created_date timestamp with time zone NOT NULL,
    updated_date timestamp with time zone NOT NULL,
    deleted_date timestamp with time zone,
    event_id uuid
);

ALTER TABLE ONLY sources
    ADD CONSTRAINT sources_pkey PRIMARY KEY (id);

ALTER TABLE ONLY sources
    ADD CONSTRAINT sources_event_id_fkey FOREIGN KEY (event_id) REFERENCES events(id) ON UPDATE CASCADE ON DELETE SET NULL;

--
-- event_tags
--
CREATE TABLE event_tags (
    created_date timestamp with time zone NOT NULL,
    updated_date timestamp with time zone NOT NULL,
    tag_id uuid NOT NULL,
    event_id uuid NOT NULL
);

ALTER TABLE ONLY event_tags
    ADD CONSTRAINT event_tags_pkey PRIMARY KEY (tag_id, event_id);

ALTER TABLE ONLY event_tags
    ADD CONSTRAINT event_tags_event_id_fkey FOREIGN KEY (event_id) REFERENCES events(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY event_tags
    ADD CONSTRAINT event_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES tags(id) ON UPDATE CASCADE ON DELETE CASCADE;
