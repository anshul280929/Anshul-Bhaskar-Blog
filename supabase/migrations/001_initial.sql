-- =============================================
-- anshulbhaskar.blog — Initial Schema
-- Adhering to Supabase & Postgres Best Practices
-- =============================================

-- Enable required extensions
create extension if not exists "pgcrypto";

-- =============================================
-- Helper Functions
-- =============================================

-- Safe is_admin helper with isolated search_path and stable subquery caching
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

-- Revoke and grant appropriate execution permissions
revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- =============================================
-- Profiles
-- =============================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text,
  avatar_url text,
  bio text,
  role text default 'reader' check (role in ('admin', 'reader')),
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

-- Public can view all profiles
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

-- Users can update their own display_name, avatar, bio, but cannot self-promote to admin
create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check (
    (select auth.uid()) = id 
    and (
      role = (select p.role from public.profiles p where p.id = (select auth.uid()))
      or (select public.is_admin())
    )
  );

-- Auto-create profile on signup with search_path secured
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', new.email),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =============================================
-- Blog Posts
-- =============================================
create table public.posts (
  id uuid default gen_random_uuid() primary key,
  author_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  slug text unique not null,
  excerpt text,
  cover_image_url text,
  content jsonb not null default '{}',
  tags text[] default '{}',
  status text default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.posts enable row level security;

-- Optimized RLS policies with subquery wrapping
create policy "Public read published posts"
  on public.posts for select
  using (status = 'published' or (select public.is_admin()));

create policy "Admin can insert posts"
  on public.posts for insert
  to authenticated
  with check ((select public.is_admin()));

create policy "Admin can update posts"
  on public.posts for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Admin can delete posts"
  on public.posts for delete
  to authenticated
  using ((select public.is_admin()));

-- Auto-update updated_at timestamp
create or replace function public.update_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger posts_updated_at
  before update on public.posts
  for each row execute procedure public.update_updated_at();

-- Indexes for queries, sorting, and foreign keys
create index idx_posts_author_id on public.posts(author_id);
create index idx_posts_slug on public.posts(slug);
create index idx_posts_status on public.posts(status);
create index idx_posts_published_at on public.posts(published_at desc);
create index idx_posts_published_partial on public.posts (published_at desc) where status = 'published';

-- =============================================
-- Reactions
-- =============================================
create table public.reactions (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.posts(id) on delete cascade not null,
  emoji text not null check (emoji in ('👍', '❤️', '🔥', '🚀', '💡', '👏')),
  session_id text not null,
  created_at timestamptz default now(),
  unique(post_id, emoji, session_id)
);

alter table public.reactions enable row level security;

create policy "Anyone can read reactions"
  on public.reactions for select
  using (true);

create policy "Anyone can add reactions"
  on public.reactions for insert
  with check (true);

create policy "Users can remove own reactions"
  on public.reactions for delete
  using (true);

create index idx_reactions_post on public.reactions(post_id);

-- =============================================
-- Contact Messages
-- =============================================
create table public.contact_messages (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  subject text,
  message text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

alter table public.contact_messages enable row level security;

create policy "Anyone can submit contact"
  on public.contact_messages for insert
  with check (true);

create policy "Admin reads contact messages"
  on public.contact_messages for select
  to authenticated
  using ((select public.is_admin()));

create policy "Admin updates contact messages"
  on public.contact_messages for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create index idx_contact_messages_created_at on public.contact_messages(created_at desc);

-- =============================================
-- News Cache
-- =============================================
create table public.news_cache (
  id uuid default gen_random_uuid() primary key,
  article_id text unique not null,
  title text,
  description text,
  source_name text,
  source_url text,
  image_url text,
  category text[],
  published_at timestamptz,
  fetched_at timestamptz default now()
);

alter table public.news_cache enable row level security;

create policy "Public read news"
  on public.news_cache for select
  using (true);

create index idx_news_cache_published on public.news_cache(published_at desc);
create index idx_news_cache_category on public.news_cache using gin(category);

-- =============================================
-- Storage: Media Bucket Configuration
-- =============================================
-- 1. Create the 'media' bucket if not exists
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

-- 2. Storage RLS Policies (Requires INSERT + SELECT + UPDATE for complete lifecycle/upserts)
create policy "Public media view access"
  on storage.objects for select
  using (bucket_id = 'media');

create policy "Admin upload media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media' and (select public.is_admin()));

create policy "Admin update media"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media' and (select public.is_admin()))
  with check (bucket_id = 'media' and (select public.is_admin()));

create policy "Admin delete media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media' and (select public.is_admin()));
