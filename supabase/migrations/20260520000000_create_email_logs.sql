-- Create email_logs table
create table if not exists email_logs (
  id          uuid primary key default gen_random_uuid(),
  client_id   uuid references clients(id) on delete set null,
  template    text not null,
  to_email    text not null,
  subject     text not null,
  status      text not null default 'sent' check (status in ('sent', 'failed')),
  error       text,
  created_at  timestamptz not null default now()
);

-- Indices
create index email_logs_client_id_idx on email_logs(client_id);
create index email_logs_created_at_idx on email_logs(created_at);

-- RLS
alter table email_logs enable row level security;

create policy "authenticated users can read email_logs"
  on email_logs for select
  to authenticated
  using (true);

create policy "authenticated users can insert email_logs"
  on email_logs for insert
  to authenticated
  with check (true);
