-- Up Migration
ALTER TABLE comments
ADD COLUMN created_at timestamp without time zone DEFAULT now() NOT NULL;
ALTER TABLE comments
ALTER COLUMN content TYPE varchar(256);
CREATE INDEX comments_keyset_idx ON public.comments USING btree (created_at DESC, id DESC, content);
-- Down Migration
DROP INDEX comments_keyset_idx;
ALTER TABLE comments DROP COLUMN created_at;
ALTER TABLE comments
ALTER COLUMN content TYPE varchar(64);