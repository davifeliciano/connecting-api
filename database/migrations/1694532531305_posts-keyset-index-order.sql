-- Up Migration
CREATE INDEX posts_keyset_idx ON public.posts USING btree (created_at DESC, id DESC, caption);
DROP INDEX posts_keyset_index;
-- Down Migration
CREATE INDEX posts_keyset_index ON public.posts USING btree (id, created_at, caption);
DROP INDEX posts_keyset_idx;