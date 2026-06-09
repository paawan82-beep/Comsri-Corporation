-- create_reviews_table.sql
-- Run this script in your Supabase SQL Editor to initialize the product_reviews table
-- with Row Level Security (RLS) policies configured to prevent review manipulation.

create table if not exists public.product_reviews (
  id uuid default gen_random_uuid() primary key,
  product_id bigint not null,
  product_slug text not null,
  name text not null,
  email text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  content text not null,
  created_at timestamptz default now() not null
);

-- Enable Row Level Security (RLS)
alter table public.product_reviews enable row level security;

-- Create policy to allow anonymous select queries
create policy "Allow public read access"
  on public.product_reviews
  for select
  using (true);

-- Create policy to allow anonymous insert queries
create policy "Allow public insert access"
  on public.product_reviews
  for insert
  with check (true);
