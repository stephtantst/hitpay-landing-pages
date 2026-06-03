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
  html text not null,
  filename text not null,
  figma_frame_id text,
  figma_plugin_js text,
  mcp_context jsonb,
  status text default 'ready' check (status in ('ready', 'published'))
);

-- Indexes for common queries
create index if not exists generated_pages_created_at_idx on generated_pages(created_at desc);
create index if not exists generated_pages_brief_id_idx on generated_pages(brief_id);

-- RLS: enable but allow service role full access
alter table briefs enable row level security;
alter table generated_pages enable row level security;

-- Service role policy (used by Next.js API routes with SUPABASE_SERVICE_ROLE_KEY)
create policy "Service role full access on briefs"
  on briefs for all
  using (true)
  with check (true);

create policy "Service role full access on generated_pages"
  on generated_pages for all
  using (true)
  with check (true);
