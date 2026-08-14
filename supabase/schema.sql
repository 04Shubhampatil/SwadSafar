-- ═══════════════════════════════════════════════════════════════════════
--  Foodi — Profile System + Backend
--  Run this in the Supabase SQL Editor (or via `supabase db push`).
--  Idempotent: safe to run multiple times.
-- ═══════════════════════════════════════════════════════════════════════

-- Every `create policy` is wrapped in a DO block that swallows the
-- duplicate_object error, so re-running the script never fails midway.

-- ── Helper: updated_at trigger ──────────────────────────────────────────
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ────────────────────────────────────────────────────────────────────────
--  profiles
-- ────────────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null unique references auth.users (id) on delete cascade,
  full_name  text,
  username   text unique,
  avatar_url text,
  bio        text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger handle_profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

alter table public.profiles enable row level security;

-- Profiles are public (names/avatars shown across the app and community feed).
do $$
begin
  create policy "Profiles are readable"
    on public.profiles for select
    to public
    using (true);
exception when duplicate_object then null;
end;
$$;

do $$
begin
  create policy "Users can insert their own profile"
    on public.profiles for insert
    to authenticated
    with check (user_id = auth.uid());
exception when duplicate_object then null;
end;
$$;

do $$
begin
  create policy "Users can update their own profile"
    on public.profiles for update
    to authenticated
    using (user_id = auth.uid())
    with check (user_id = auth.uid());
exception when duplicate_object then null;
end;
$$;

do $$
begin
  create policy "Users can delete their own profile"
    on public.profiles for delete
    to authenticated
    using (user_id = auth.uid());
exception when duplicate_object then null;
end;
$$;

-- Auto-create a profile the first time an auth user signs up.
-- Uses Google OAuth metadata (full_name/name, avatar_url/picture, username).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (user_id, full_name, username, avatar_url)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name'
    ),
    coalesce(
      new.raw_user_meta_data ->> 'username',
      new.raw_user_meta_data ->> 'user_name',
      lower(split_part(coalesce(new.raw_user_meta_data ->> 'email', 'user'), '@', 1))
    ),
    coalesce(
      new.raw_user_meta_data ->> 'avatar_url',
      new.raw_user_meta_data ->> 'picture'
    )
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ────────────────────────────────────────────────────────────────────────
--  favorites  (a recipe the user has "hearted")
--  recipe_id references either the catalog recipe id or a recipes.id.
-- ────────────────────────────────────────────────────────────────────────
create table if not exists public.favorites (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  recipe_id  text not null,
  created_at timestamptz not null default now(),
  constraint favorites_user_recipe_unique unique (user_id, recipe_id)
);

create index if not exists favorites_user_id_idx on public.favorites (user_id);

alter table public.favorites enable row level security;

do $$
begin
  create policy "Users can read own favorites"
    on public.favorites for select
    to authenticated
    using (auth.uid() = user_id);
exception when duplicate_object then null;
end;
$$;

do $$
begin
  create policy "Users can add own favorites"
    on public.favorites for insert
    to authenticated
    with check (auth.uid() = user_id);
exception when duplicate_object then null;
end;
$$;

do $$
begin
  create policy "Users can update own favorites"
    on public.favorites for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);
exception when duplicate_object then null;
end;
$$;

do $$
begin
  create policy "Users can delete own favorites"
    on public.favorites for delete
    to authenticated
    using (auth.uid() = user_id);
exception when duplicate_object then null;
end;
$$;

-- ────────────────────────────────────────────────────────────────────────
--  saved_recipes  (personal cookbook — separate concept from favorites)
-- ────────────────────────────────────────────────────────────────────────
create table if not exists public.saved_recipes (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  recipe_id  text not null,
  created_at timestamptz not null default now(),
  constraint saved_recipes_user_recipe_unique unique (user_id, recipe_id)
);

create index if not exists saved_recipes_user_id_idx on public.saved_recipes (user_id);

alter table public.saved_recipes enable row level security;

do $$
begin
  create policy "Users can read own saved recipes"
    on public.saved_recipes for select
    to authenticated
    using (auth.uid() = user_id);
exception when duplicate_object then null;
end;
$$;

do $$
begin
  create policy "Users can add own saved recipes"
    on public.saved_recipes for insert
    to authenticated
    with check (auth.uid() = user_id);
exception when duplicate_object then null;
end;
$$;

do $$
begin
  create policy "Users can update own saved recipes"
    on public.saved_recipes for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);
exception when duplicate_object then null;
end;
$$;

do $$
begin
  create policy "Users can delete own saved recipes"
    on public.saved_recipes for delete
    to authenticated
    using (auth.uid() = user_id);
exception when duplicate_object then null;
end;
$$;

-- ────────────────────────────────────────────────────────────────────────
--  notifications
-- ────────────────────────────────────────────────────────────────────────
create table if not exists public.notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  type       text not null default 'info',
  title      text not null,
  message    text,
  metadata   jsonb not null default '{}',
  read       boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_id_idx on public.notifications (user_id, created_at desc);

alter table public.notifications enable row level security;

do $$
begin
  create policy "Users can read own notifications"
    on public.notifications for select
    to authenticated
    using (auth.uid() = user_id);
exception when duplicate_object then null;
end;
$$;

do $$
begin
  create policy "Users can create own notifications"
    on public.notifications for insert
    to authenticated
    with check (auth.uid() = user_id);
exception when duplicate_object then null;
end;
$$;

do $$
begin
  create policy "Users can update own notifications"
    on public.notifications for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);
exception when duplicate_object then null;
end;
$$;

do $$
begin
  create policy "Users can delete own notifications"
    on public.notifications for delete
    to authenticated
    using (auth.uid() = user_id);
exception when duplicate_object then null;
end;
$$;

-- Cross-user notifications (e.g. someone liked/commented on your post) cannot
-- be inserted by the anon/authenticated role because RLS restricts inserts to
-- your own user_id. This SECURITY DEFINER helper lets the API safely notify the
-- owner of a post/recipe while keeping RLS fully enabled.
create or replace function public.create_notification(
  p_user_id uuid,
  p_type text,
  p_title text,
  p_message text default null,
  p_metadata jsonb default '{}'
)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  if p_user_id is null then
    return;
  end if;
  insert into public.notifications (user_id, type, title, message, metadata)
  values (p_user_id, p_type, p_title, p_message, p_metadata);
end;
$$;

grant execute on function public.create_notification(uuid, text, text, text, jsonb)
  to authenticated, service_role;

-- ────────────────────────────────────────────────────────────────────────
--  Storage: avatars bucket + ownership policies
--  Files are stored at avatars/<user_id>/<safe-filename> — users can only
--  manage files inside their own directory.
-- ────────────────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Public read (bucket is public).
do $$
begin
  create policy "Public read avatars"
    on storage.objects for select
    to public
    using (bucket_id = 'avatars');
exception when duplicate_object then null;
end;
$$;

-- Upload only into your own directory.
do $$
begin
  create policy "Users can upload own avatar"
    on storage.objects for insert
    to authenticated
    with check (
      bucket_id = 'avatars'
      and (storage.foldername(name))[1] = auth.uid()::text
    );
exception when duplicate_object then null;
end;
$$;

-- Update only files in your own directory.
do $$
begin
  create policy "Users can update own avatar"
    on storage.objects for update
    to authenticated
    using (
      bucket_id = 'avatars'
      and (storage.foldername(name))[1] = auth.uid()::text
    )
    with check (
      bucket_id = 'avatars'
      and (storage.foldername(name))[1] = auth.uid()::text
    );
exception when duplicate_object then null;
end;
$$;

-- Delete only files in your own directory.
do $$
begin
  create policy "Users can delete own avatar"
    on storage.objects for delete
    to authenticated
    using (
      bucket_id = 'avatars'
      and (storage.foldername(name))[1] = auth.uid()::text
    );
exception when duplicate_object then null;
end;
$$;

-- ────────────────────────────────────────────────────────────────────────
--  Storage: recipe-images bucket + ownership policies
--  AI food images are stored at recipe-images/<user_id>/<unique-file> — users
--  can only manage files inside their own directory (RLS-enforced).
-- ────────────────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('recipe-images', 'recipe-images', true)
on conflict (id) do nothing;

-- Public read (bucket is public, images appear on recipe cards/community feed).
do $$
begin
  create policy "Public read recipe images"
    on storage.objects for select
    to public
    using (bucket_id = 'recipe-images');
exception when duplicate_object then null;
end;
$$;

-- Upload only into your own directory.
do $$
begin
  create policy "Users can upload own recipe images"
    on storage.objects for insert
    to authenticated
    with check (
      bucket_id = 'recipe-images'
      and (storage.foldername(name))[1] = auth.uid()::text
    );
exception when duplicate_object then null;
end;
$$;

-- Update only files in your own directory.
do $$
begin
  create policy "Users can update own recipe images"
    on storage.objects for update
    to authenticated
    using (
      bucket_id = 'recipe-images'
      and (storage.foldername(name))[1] = auth.uid()::text
    )
    with check (
      bucket_id = 'recipe-images'
      and (storage.foldername(name))[1] = auth.uid()::text
    );
exception when duplicate_object then null;
end;
$$;

-- Delete only files in your own directory.
do $$
begin
  create policy "Users can delete own recipe images"
    on storage.objects for delete
    to authenticated
    using (
      bucket_id = 'recipe-images'
      and (storage.foldername(name))[1] = auth.uid()::text
    );
exception when duplicate_object then null;
end;
$$;

-- ────────────────────────────────────────────────────────────────────────
--  recipes  (user-created recipes, AI drafts and published community recipes)
--  `status` distinguishes unpublished drafts from published community recipes.
-- ────────────────────────────────────────────────────────────────────────
create table if not exists public.recipes (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  title        text not null default '',
  description  text not null default '',
  image        text,
  cuisine      text not null default '',
  prep_time    int not null default 10,
  cook_time    int not null default 20,
  difficulty   text not null default 'Medium',
  servings     int not null default 4,
  calories     int not null default 0,
  dietary      text[] not null default '{}',
  ingredients  jsonb not null default '[]',
  instructions jsonb not null default '[]',
  rating       numeric not null default 4.5,
  reviews_count int not null default 0,
  cooks        text not null default '0',
  status       text not null default 'draft' check (status in ('draft', 'published')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists recipes_user_id_idx on public.recipes (user_id);
create index if not exists recipes_status_idx on public.recipes (status);

create trigger handle_recipes_updated_at
  before update on public.recipes
  for each row execute function public.handle_updated_at();

alter table public.recipes enable row level security;

-- Anyone (including guests) can read published recipes; the author can always
-- read their own (including drafts).
do $$
begin
  create policy "Recipes are readable"
    on public.recipes for select
    to public
    using (status = 'published' or user_id = auth.uid());
exception when duplicate_object then null;
end;
$$;

do $$
begin
  create policy "Users can add their own recipes"
    on public.recipes for insert
    to authenticated
    with check (user_id = auth.uid());
exception when duplicate_object then null;
end;
$$;

do $$
begin
  create policy "Users can update their own recipes"
    on public.recipes for update
    to authenticated
    using (user_id = auth.uid())
    with check (user_id = auth.uid());
exception when duplicate_object then null;
end;
$$;

do $$
begin
  create policy "Users can delete their own recipes"
    on public.recipes for delete
    to authenticated
    using (user_id = auth.uid());
exception when duplicate_object then null;
end;
$$;

-- ────────────────────────────────────────────────────────────────────────
--  community_posts  (posts in the community feed; may link a recipe)
-- ────────────────────────────────────────────────────────────────────────
create table if not exists public.community_posts (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  recipe_id  uuid references public.recipes (id) on delete set null,
  content    text not null default '',
  image      text,
  images     text[] not null default '{}',
  category   text not null default 'Dinner',
  tags       text[] not null default '{}',
  poll       jsonb,
  created_at timestamptz not null default now()
);

-- Relationship to profiles lets PostgREST embed the author when loading the feed.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'community_posts_user_id_profiles_fkey'
  ) then
    alter table public.community_posts
      add constraint community_posts_user_id_profiles_fkey
      foreign key (user_id) references public.profiles (user_id) on delete cascade;
  end if;
end;
$$;

create index if not exists community_posts_user_id_idx on public.community_posts (user_id);
create index if not exists community_posts_recipe_id_idx on public.community_posts (recipe_id);

alter table public.community_posts enable row level security;

-- The community feed is public — guests and members see the same posts.
do $$
begin
  create policy "Community posts are readable"
    on public.community_posts for select
    to public
    using (true);
exception when duplicate_object then null;
end;
$$;

do $$
begin
  create policy "Users can create their own community posts"
    on public.community_posts for insert
    to authenticated
    with check (user_id = auth.uid());
exception when duplicate_object then null;
end;
$$;

do $$
begin
  create policy "Users can update their own community posts"
    on public.community_posts for update
    to authenticated
    using (user_id = auth.uid())
    with check (user_id = auth.uid());
exception when duplicate_object then null;
end;
$$;

do $$
begin
  create policy "Users can delete their own community posts"
    on public.community_posts for delete
    to authenticated
    using (user_id = auth.uid());
exception when duplicate_object then null;
end;
$$;

-- ────────────────────────────────────────────────────────────────────────
--  community_post_comments  (comments on community feed posts)
-- ────────────────────────────────────────────────────────────────────────
create table if not exists public.community_post_comments (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid not null references public.community_posts (id) on delete cascade,
  user_id    uuid not null references auth.users (id) on delete cascade,
  content    text not null,
  created_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'community_post_comments_user_id_profiles_fkey'
  ) then
    alter table public.community_post_comments
      add constraint community_post_comments_user_id_profiles_fkey
      foreign key (user_id) references public.profiles (user_id) on delete cascade;
  end if;
end;
$$;

create index if not exists community_post_comments_post_id_idx on public.community_post_comments (post_id);
create index if not exists community_post_comments_user_id_idx on public.community_post_comments (user_id);

alter table public.community_post_comments enable row level security;

do $$
begin
  create policy "Comments are readable"
    on public.community_post_comments for select
    to public
    using (true);
exception when duplicate_object then null;
end;
$$;

do $$
begin
  create policy "Users can add comments"
    on public.community_post_comments for insert
    to authenticated
    with check (user_id = auth.uid());
exception when duplicate_object then null;
end;
$$;

do $$
begin
  create policy "Users can update their own comments"
    on public.community_post_comments for update
    to authenticated
    using (user_id = auth.uid())
    with check (user_id = auth.uid());
exception when duplicate_object then null;
end;
$$;

do $$
begin
  create policy "Users can delete their own comments"
    on public.community_post_comments for delete
    to authenticated
    using (user_id = auth.uid());
exception when duplicate_object then null;
end;
$$;

-- ────────────────────────────────────────────────────────────────────────
--  likes  (a user "likes" either a recipe or a community post)
--  Exactly one of recipe_id / post_id must be set. Uniqueness is enforced
--  with partial indexes so a user can't like the same target twice while
--  still allowing either target type.
-- ────────────────────────────────────────────────────────────────────────
create table if not exists public.likes (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  recipe_id  uuid references public.recipes (id) on delete cascade,
  post_id    uuid references public.community_posts (id) on delete cascade,
  created_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'likes_single_target'
  ) then
    alter table public.likes
      add constraint likes_single_target check (num_nonnulls(recipe_id, post_id) = 1);
  end if;
end;
$$;

create unique index if not exists likes_user_post_idx
  on public.likes (user_id, post_id) where post_id is not null;
create unique index if not exists likes_user_recipe_idx
  on public.likes (user_id, recipe_id) where recipe_id is not null;

create index if not exists likes_post_id_idx on public.likes (post_id);
create index if not exists likes_recipe_id_idx on public.likes (recipe_id);

alter table public.likes enable row level security;

-- Like counts are public (shown on the community feed).
do $$
begin
  create policy "Likes are readable"
    on public.likes for select
    to public
    using (true);
exception when duplicate_object then null;
end;
$$;

do $$
begin
  create policy "Users can add their own likes"
    on public.likes for insert
    to authenticated
    with check (user_id = auth.uid());
exception when duplicate_object then null;
end;
$$;

do $$
begin
  create policy "Users can update their own likes"
    on public.likes for update
    to authenticated
    using (user_id = auth.uid())
    with check (user_id = auth.uid());
exception when duplicate_object then null;
end;
$$;

do $$
begin
  create policy "Users can delete their own likes"
    on public.likes for delete
    to authenticated
    using (user_id = auth.uid());
exception when duplicate_object then null;
end;
$$;
