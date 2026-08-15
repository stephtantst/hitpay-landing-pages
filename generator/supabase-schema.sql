-- Run this in your Supabase SQL editor to set up the landing page generator schema

create table if not exists briefs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  created_by text,
  vertical text not null,
  market text[] not null,
  brief jsonb not null,
  status text default 'draft' check (status in ('draft', 'generating', 'done', 'error'))
);

create table if not exists generated_pages (
  id uuid primary key default gen_random_uuid(),
  brief_id uuid references briefs(id) on delete cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  html text not null,
  filename text not null,
  figma_frame_id text,
  figma_plugin_js text,
  mcp_context jsonb,
  status text default 'draft' check (status in ('draft', 'design', 'web_dev', 'published')),
  url_slug text,
  meta_title text,
  meta_description text,
  final_url text
);

-- Snapshots taken before each refine/restore, so a refine can be undone
create table if not exists page_revisions (
  id uuid primary key default gen_random_uuid(),
  page_id uuid references generated_pages(id) on delete cascade,
  created_at timestamptz default now(),
  html text not null,
  instruction text not null
);

-- Indexes for common queries
create index if not exists generated_pages_created_at_idx on generated_pages(created_at desc);
create index if not exists generated_pages_brief_id_idx on generated_pages(brief_id);
create index if not exists page_revisions_page_id_idx on page_revisions(page_id, created_at desc);

-- RLS: enable but allow service role full access
alter table briefs enable row level security;
alter table generated_pages enable row level security;
alter table page_revisions enable row level security;

-- Service role policy (used by Next.js API routes with SUPABASE_SERVICE_ROLE_KEY)
create policy "Service role full access on briefs"
  on briefs for all
  using (true)
  with check (true);

create policy "Service role full access on generated_pages"
  on generated_pages for all
  using (true)
  with check (true);

create policy "Service role full access on page_revisions"
  on page_revisions for all
  using (true)
  with check (true);

-- ─────────────────────────────────────────────────────────────────────────
-- MIGRATION (run this block only if you already have the schema above,
-- e.g. an existing generated_pages table without updated_at / page_revisions)
-- ─────────────────────────────────────────────────────────────────────────
-- alter table generated_pages add column if not exists updated_at timestamptz default now();
-- create table if not exists page_revisions (
--   id uuid primary key default gen_random_uuid(),
--   page_id uuid references generated_pages(id) on delete cascade,
--   created_at timestamptz default now(),
--   html text not null,
--   instruction text not null
-- );
-- create index if not exists page_revisions_page_id_idx on page_revisions(page_id, created_at desc);
-- alter table page_revisions enable row level security;
-- create policy "Service role full access on page_revisions" on page_revisions for all using (true) with check (true);

-- Widen generated_pages.status from ('ready','published') to a 4-stage manual
-- workflow status ('draft','design','web_dev','published'), defaulting to 'draft'.
-- alter table generated_pages drop constraint if exists generated_pages_status_check;
-- update generated_pages set status = 'draft' where status = 'ready';
-- alter table generated_pages alter column status set default 'draft';
-- alter table generated_pages add constraint generated_pages_status_check check (status in ('draft', 'design', 'web_dev', 'published'));

-- SEO/tracking fields mirroring the growth team's "Website SEO_AEO" spreadsheet
-- columns (URL Slug, Meta Title, Meta Description, Final URL), auto-derived per page.
-- alter table generated_pages add column if not exists url_slug text;
-- alter table generated_pages add column if not exists meta_title text;
-- alter table generated_pages add column if not exists meta_description text;
-- alter table generated_pages add column if not exists final_url text;
