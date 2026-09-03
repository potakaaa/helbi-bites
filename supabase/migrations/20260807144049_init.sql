-- Schema for the lil' bites feedback app, captured from the production project
-- (ffrszkaelpsholeoxwzz) with `supabase db dump --schema public`.
--
-- Keep this in step with production by hand. Note that production's migration
-- history predates this file, so `supabase db push` will not line up against
-- it -- this exists so `supabase start` / `db reset` can build a faithful
-- local copy.

create table if not exists public.feedback (
    id uuid primary key default gen_random_uuid(),
    batch text,
    rating smallint not null,
    texture text,
    sweetness text,
    chocolate_flavor text,
    portion_size text,
    buy_again text,
    comment text,
    created_at timestamptz not null default now(),
    constraint feedback_rating_check check (rating >= 1 and rating <= 5),
    constraint feedback_texture_check check (texture = any (array['too_soft', 'just_right', 'too_firm'])),
    constraint feedback_sweetness_check check (sweetness = any (array['not_sweet_enough', 'just_right', 'too_sweet'])),
    constraint feedback_chocolate_flavor_check check (chocolate_flavor = any (array['too_light', 'just_right', 'too_rich'])),
    constraint feedback_portion_size_check check (portion_size = any (array['too_small', 'just_right', 'too_much'])),
    constraint feedback_buy_again_check check (buy_again = any (array['definitely', 'maybe', 'probably_not']))
);

create table if not exists public.subscribers (
    id uuid primary key default gen_random_uuid(),
    email text not null,
    marketing_consent boolean not null default false,
    batch text,
    consented_at timestamptz not null default now()
);

create index if not exists feedback_created_at_idx on public.feedback using btree (created_at desc);
create index if not exists feedback_batch_idx on public.feedback using btree (batch);
create index if not exists subscribers_email_idx on public.subscribers using btree (email);

alter table public.feedback enable row level security;
alter table public.subscribers enable row level security;

-- The public form writes with the anon key. There is deliberately no SELECT
-- policy: reading feedback (and customer emails) requires the secret key, which
-- only the /admin server code holds.
create policy "Anyone can submit feedback"
    on public.feedback for insert to anon with check (true);

create policy "Anyone can subscribe"
    on public.subscribers for insert to anon with check (true);
