-- Swastika Interlocking Complete Supabase Storage Schema

-- Insert storage buckets
insert into storage.buckets (id, name, public)
values 
  ('products', 'products', true),
  ('projects', 'projects', true),
  ('documents', 'documents', false)
on conflict (id) do nothing;

-- Set up storage policies for 'products' bucket
create policy "Products Images are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'products' );

create policy "Admin can insert products images"
  on storage.objects for insert
  with check ( 
    bucket_id = 'products' 
    and auth.role() = 'authenticated' 
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admin can update products images"
  on storage.objects for update
  using ( 
    bucket_id = 'products' 
    and auth.role() = 'authenticated' 
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admin can delete products images"
  on storage.objects for delete
  using ( 
    bucket_id = 'products' 
    and auth.role() = 'authenticated' 
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Set up storage policies for 'projects' bucket
create policy "Projects Photos are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'projects' );

create policy "Admin can insert projects photos"
  on storage.objects for insert
  with check ( 
    bucket_id = 'projects' 
    and auth.role() = 'authenticated' 
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admin can update projects photos"
  on storage.objects for update
  using ( 
    bucket_id = 'projects' 
    and auth.role() = 'authenticated' 
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admin can delete projects photos"
  on storage.objects for delete
  using ( 
    bucket_id = 'projects' 
    and auth.role() = 'authenticated' 
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Set up storage policies for 'documents' bucket
create policy "Admin can view documents"
  on storage.objects for select
  using ( 
    bucket_id = 'documents' 
    and auth.role() = 'authenticated' 
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admin can insert documents"
  on storage.objects for insert
  with check ( 
    bucket_id = 'documents' 
    and auth.role() = 'authenticated' 
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admin can update documents"
  on storage.objects for update
  using ( 
    bucket_id = 'documents' 
    and auth.role() = 'authenticated' 
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admin can delete documents"
  on storage.objects for delete
  using ( 
    bucket_id = 'documents' 
    and auth.role() = 'authenticated' 
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
