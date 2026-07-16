import MediaLibrary from "../../../components/admin/media/MediaLibrary";
import { createClient } from "../../../lib/supabase/server";

export const dynamic = "force-dynamic";

type MediaFile = {
  name: string;
  id: string | null;
  created_at: string | null;
  updated_at: string | null;
  metadata: Record<string, unknown> | null;
  publicUrl: string;
};

export default async function AdminMediaPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.storage
    .from("product-media")
    .list("", {
      limit: 200,
      sortBy: {
        column: "created_at",
        order: "desc",
      },
    });

  if (error) {
    return (
      <>
        <section className="admin-page-heading">
          <div>
            <span>SUPABASE STORAGE</span>
            <h1>MEDIA</h1>

            <p>
              Upload and organize product images for the storefront.
            </p>
          </div>
        </section>

        <section className="admin-panel">
          <h2>STORAGE ERROR</h2>

          <p style={{ color: "var(--admin-muted)" }}>
            {error.message}
          </p>

          <p style={{ color: "var(--admin-muted)" }}>
            Confirm that a public Supabase Storage bucket named
            <strong> product-media </strong>
            exists.
          </p>
        </section>
      </>
    );
  }

  const files: MediaFile[] = (data ?? [])
    .filter((file) => file.name && !file.name.endsWith("/"))
    .map((file) => {
      const {
        data: { publicUrl },
      } = supabase.storage
        .from("product-media")
        .getPublicUrl(file.name);

      return {
        name: file.name,
        id: file.id ?? null,
        created_at: file.created_at ?? null,
        updated_at: file.updated_at ?? null,
        metadata:
          (file.metadata as Record<string, unknown> | null) ??
          null,
        publicUrl,
      };
    });

  return (
    <>
      <section className="admin-page-heading">
        <div>
          <span>SUPABASE STORAGE</span>
          <h1>MEDIA</h1>

          <p>
            Upload, preview, copy, and remove cloud-hosted product
            images.
          </p>
        </div>

        <strong>{files.length} FILES</strong>
      </section>

      <MediaLibrary initialFiles={files} />
    </>
  );
}