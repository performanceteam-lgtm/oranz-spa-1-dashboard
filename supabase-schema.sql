-- Run this once inside Supabase: Project -> SQL Editor -> New query -> paste -> Run

create extension if not exists "pgcrypto";

create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  client_code text unique,
  name text not null,
  phone text,
  whatsapp text,
  email text,
  dob date not null,
  gender text,
  city text,
  membership text default 'Silver',
  branch text default 'Agra',
  last_visit date,
  status text default 'Active',
  vip boolean default false,
  anniversary date,
  notes text,
  created_at timestamptz default now()
);

-- Prevents the cron job from sending the same wish twice on the same day
create table if not exists wish_log (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  channel text not null,       -- 'whatsapp' or 'email'
  wish_date date not null,     -- the calendar date the wish was for
  sent_at timestamptz default now(),
  unique (client_id, channel, wish_date)
);

-- Sample rows (delete these later, they're just so the dashboard isn't empty on first load)
insert into clients (client_code, name, phone, whatsapp, email, dob, gender, city, membership, branch, last_visit, status, vip)
values
  ('OBS-1001','Aisha Kapoor','+919811022341','+919811022341','aisha.kapoor@mail.com','1990-08-27','Female','Agra','Platinum','Agra','2026-08-02','Active', true),
  ('OBS-1002','Rohan Mehta','+919820011223','+919820011223','rohan.mehta@mail.com','1985-08-27','Male','Gwalior','Gold','Gwalior','2026-07-19','Active', false),
  ('OBS-1004','Kabir Singh','+919988765432','+919988765432','kabir.singh@mail.com','1992-08-28','Male','Agra','Gold','Agra','2026-08-10','Active', false)
on conflict do nothing;
