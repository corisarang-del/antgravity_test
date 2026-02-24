-- 0002_user_access_policy.sql
-- 사용자/등급/구독/권한 관련 기본 스키마

create table if not exists public.users (
  id uuid primary key,
  email text unique not null,
  display_name text not null,
  level_score integer not null default 0 check (level_score >= 0),
  is_paid_subscriber boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_access_policy (
  user_id uuid primary key references public.users(id) on delete cascade,
  dashboard_access boolean not null default true,
  personalization_access boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.user_subscriptions (
  id uuid primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  status text not null check (status in ('active','inactive','cancelled')),
  started_at timestamptz not null default now(),
  ended_at timestamptz
);

create index if not exists idx_users_level_score on public.users(level_score);
create index if not exists idx_subscriptions_user_status on public.user_subscriptions(user_id, status);