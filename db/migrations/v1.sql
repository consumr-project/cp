--
-- Name: enum_events_sentiment
--

CREATE TYPE enum_events_sentiment AS ENUM (
    'positive',
    'negative',
    'neutral'
);


--
-- Name: enum_users_lang
--

CREATE TYPE enum_users_lang AS ENUM (
    'en'
);


--
-- Name: companies
--

CREATE TABLE companies (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    summary text,
    created_by uuid NOT NULL,
    updated_by uuid NOT NULL,
    deleted_by character varying(255),
    created_date timestamp with time zone NOT NULL,
    updated_date timestamp with time zone NOT NULL,
    deleted_date timestamp with time zone
);


--
-- Name: event_tags
--

CREATE TABLE event_tags (
    created_date timestamp with time zone NOT NULL,
    updated_date timestamp with time zone NOT NULL,
    tag_id uuid NOT NULL,
    event_id uuid NOT NULL
);


--
-- Name: events
--

CREATE TABLE events (
    id uuid NOT NULL,
    title character varying(255) NOT NULL,
    sentiment enum_events_sentiment NOT NULL,
    created_by uuid NOT NULL,
    updated_by uuid NOT NULL,
    deleted_by character varying(255),
    created_date timestamp with time zone NOT NULL,
    updated_date timestamp with time zone NOT NULL,
    deleted_date timestamp with time zone,
    company_id uuid
);


--
-- Name: sources
--

CREATE TABLE sources (
    id uuid NOT NULL,
    title character varying(255),
    url character varying(255) NOT NULL,
    published_date timestamp with time zone NOT NULL,
    created_by uuid NOT NULL,
    updated_by uuid NOT NULL,
    deleted_by character varying(255),
    created_date timestamp with time zone NOT NULL,
    updated_date timestamp with time zone NOT NULL,
    deleted_date timestamp with time zone,
    event_id uuid
);


--
-- Name: tags
--

CREATE TABLE tags (
    id uuid NOT NULL,
    "en-US" character varying(255) NOT NULL,
    created_by uuid NOT NULL,
    updated_by uuid NOT NULL,
    deleted_by character varying(255),
    created_date timestamp with time zone NOT NULL,
    updated_date timestamp with time zone NOT NULL,
    deleted_date timestamp with time zone
);


--
-- Name: users
--

CREATE TABLE users (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    title character varying(255),
    company_name character varying(255),
    lang enum_users_lang DEFAULT 'en'::enum_users_lang NOT NULL,
    summary text,
    avatar_url character varying(255),
    linked_url character varying(255),
    last_login_date timestamp with time zone,
    created_by uuid NOT NULL,
    updated_by uuid NOT NULL,
    deleted_by character varying(255),
    created_date timestamp with time zone NOT NULL,
    updated_date timestamp with time zone NOT NULL,
    deleted_date timestamp with time zone
);


--
-- Name: companies_pkey
--

ALTER TABLE ONLY companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (id);


--
-- Name: event_tags_pkey
--

ALTER TABLE ONLY event_tags
    ADD CONSTRAINT event_tags_pkey PRIMARY KEY (tag_id, event_id);


--
-- Name: events_pkey
--

ALTER TABLE ONLY events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: sources_pkey
--

ALTER TABLE ONLY sources
    ADD CONSTRAINT sources_pkey PRIMARY KEY (id);


--
-- Name: tags_pkey
--

ALTER TABLE ONLY tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- Name: users_pkey
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: event_tags_event_id_fkey
--

ALTER TABLE ONLY event_tags
    ADD CONSTRAINT event_tags_event_id_fkey FOREIGN KEY (event_id) REFERENCES events(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: event_tags_tag_id_fkey
--

ALTER TABLE ONLY event_tags
    ADD CONSTRAINT event_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES tags(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: events_company_id_fkey
--

ALTER TABLE ONLY events
    ADD CONSTRAINT events_company_id_fkey FOREIGN KEY (company_id) REFERENCES companies(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: sources_event_id_fkey
--

ALTER TABLE ONLY sources
    ADD CONSTRAINT sources_event_id_fkey FOREIGN KEY (event_id) REFERENCES events(id) ON UPDATE CASCADE ON DELETE SET NULL;
