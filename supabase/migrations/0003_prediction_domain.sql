-- 0003_prediction_domain.sql
-- 예측/지표/성능/알림 도메인 스키마

create table if not exists public.symbols (
  id uuid primary key,
  ticker text not null,
  market text not null,
  display_name text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(ticker, market)
);

create table if not exists public.predictions (
  id uuid primary key,
  symbol_id uuid not null references public.symbols(id) on delete cascade,
  horizon_date date not null,
  predicted_price numeric not null,
  direction text not null check (direction in ('UP','DOWN','FLAT')),
  confidence_score numeric not null check (confidence_score >= 0 and confidence_score <= 1),
  data_status text not null check (data_status in ('NORMAL','DELAYED','FAILED')),
  generated_at timestamptz not null default now()
);

create table if not exists public.indicator_snapshots (
  id uuid primary key,
  symbol_id uuid not null references public.symbols(id) on delete cascade,
  snapshot_at timestamptz not null,
  close_price numeric not null,
  volume numeric not null,
  vix numeric not null,
  fear_greed_index numeric not null check (fear_greed_index >= 0 and fear_greed_index <= 100),
  rsi_14 numeric not null,
  macd numeric not null,
  unique(symbol_id, snapshot_at)
);

create table if not exists public.performance_records (
  id uuid primary key,
  model_version text not null,
  period_start date not null,
  period_end date not null,
  da numeric not null,
  mape numeric not null,
  rmse numeric not null,
  generated_at timestamptz not null default now(),
  check (period_start < period_end)
);

create table if not exists public.watchlist_items (
  id uuid primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  symbol_id uuid not null references public.symbols(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, symbol_id)
);

create table if not exists public.alert_preferences (
  id uuid primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  symbol_id uuid not null references public.symbols(id) on delete cascade,
  is_enabled boolean not null default true,
  threshold_type text not null check (threshold_type in ('PRICE_CHANGE','CONFIDENCE_DROP','DIRECTION_CHANGE')),
  threshold_value numeric not null,
  version integer not null default 1,
  updated_at timestamptz not null default now(),
  unique(user_id, symbol_id)
);

create table if not exists public.app_notifications (
  id uuid primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  symbol_id uuid references public.symbols(id) on delete set null,
  message text not null,
  notification_date date not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now(),
  read_at timestamptz,
  dedup_key text not null,
  unique(dedup_key)
);

create index if not exists idx_predictions_symbol_generated_at on public.predictions(symbol_id, generated_at desc);
create index if not exists idx_notifications_user_read_date on public.app_notifications(user_id, is_read, notification_date desc);