-- Create the contact submissions table
create table contact_submissions (
  id bigint primary key generated always as identity,
  name text not null,
  email text not null,
  message text not null,
  status text not null default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table contact_submissions enable row level security;

-- Create policy to allow anyone to insert
create policy "Allow public to insert contact submissions"
  on contact_submissions for insert
  with check (true);

-- Create policy to allow only authenticated users to view and update
create policy "Allow authenticated users to view contact submissions"
  on contact_submissions for select
  using (auth.role() = 'authenticated');

create policy "Allow authenticated users to update contact submissions"
  on contact_submissions for update
  using (auth.role() = 'authenticated');
