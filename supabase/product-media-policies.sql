create policy "Public can view product media"
on storage.objects
for select
to public
using (bucket_id = 'product-media');

create policy "Admin can upload product media"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'product-media'
  and lower((select auth.jwt() ->> 'email')) = lower('YOUR_ADMIN_EMAIL_HERE')
);

create policy "Admin can delete product media"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'product-media'
  and lower((select auth.jwt() ->> 'email')) = lower('YOUR_ADMIN_EMAIL_HERE')
);
