"use client";

import { useMemo, useRef, useState } from "react";
import { createClient } from "../../../lib/supabase/client";

type MediaFile = {
  name: string;
  id: string | null;
  created_at: string | null;
  updated_at: string | null;
  metadata: Record<string, unknown> | null;
  publicUrl: string;
};

const allowedTypes = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/avif",
];

const maxFileSize = 12 * 1024 * 1024;

function safeFileName(name: string) {
  const extension = name.includes(".")
    ? `.${name.split(".").pop()?.toLowerCase()}`
    : "";

  const base = name
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${Date.now()}-${base || "product-image"}${extension}`;
}

export default function MediaLibrary({
  initialFiles,
}: {
  initialFiles: MediaFile[];
}) {
  const supabase = useMemo(() => createClient(), []);
  const inputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState(initialFiles);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  async function uploadFiles(fileList: FileList | File[]) {
    const selected = Array.from(fileList);
    if (selected.length === 0) return;

    setUploading(true);
    setMessage("");

    try {
      for (const file of selected) {
        if (!allowedTypes.includes(file.type)) {
          throw new Error(`${file.name} is not supported.`);
        }

        if (file.size > maxFileSize) {
          throw new Error(`${file.name} is larger than 12 MB.`);
        }

        const name = safeFileName(file.name);

        const { error } = await supabase.storage
          .from("product-media")
          .upload(name, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type,
          });

        if (error) throw error;

        const { data } = supabase.storage
          .from("product-media")
          .getPublicUrl(name);

        setFiles((current) => [
          {
            name,
            id: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            metadata: { size: file.size, mimetype: file.type },
            publicUrl: data.publicUrl,
          },
          ...current,
        ]);
      }

      setMessage("Upload complete.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Upload failed."
      );
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function deleteFile(file: MediaFile) {
    if (!window.confirm(`Delete ${file.name}?`)) return;

    const { error } = await supabase.storage
      .from("product-media")
      .remove([file.name]);

    if (error) {
      setMessage(error.message);
      return;
    }

    setFiles((current) =>
      current.filter((item) => item.name !== file.name)
    );
    setMessage("Image deleted.");
  }

  async function copyUrl(url: string) {
    await navigator.clipboard.writeText(url);
    setMessage("Image URL copied.");
  }

  return (
    <div className="admin-media-layout">
      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <span>UPLOAD</span>
            <h2>ADD IMAGES</h2>
          </div>
        </div>

        <div
          className="admin-media-dropzone"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            void uploadFiles(event.dataTransfer.files);
          }}
        >
          <span>DROP PRODUCT IMAGES HERE</span>
          <strong>PNG, JPG, WEBP OR AVIF</strong>
          <small>MAXIMUM 12 MB PER FILE</small>

          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? "UPLOADING..." : "CHOOSE FILES"}
          </button>

          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/avif"
            multiple
            hidden
            onChange={(event) => {
              if (event.target.files) {
                void uploadFiles(event.target.files);
              }
            }}
          />
        </div>

        {message ? <div className="admin-media-message">{message}</div> : null}
      </section>

      <section className="admin-panel">
        <div className="admin-panel-heading admin-media-toolbar">
          <div>
            <span>LIBRARY</span>
            <h2>PRODUCT MEDIA</h2>
          </div>

          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="SEARCH FILES"
          />
        </div>

        {filteredFiles.length === 0 ? (
          <div className="admin-empty-state">
            <span>NO MEDIA</span>
            <h3>NO IMAGES FOUND</h3>
            <p>Upload product images to begin.</p>
          </div>
        ) : (
          <div className="admin-media-grid">
            {filteredFiles.map((file) => (
              <article className="admin-media-card" key={file.name}>
                <div className="admin-media-preview">
                  <img src={file.publicUrl} alt={file.name} />
                </div>

                <div className="admin-media-card-info">
                  <strong>{file.name}</strong>
                  <small>
                    {file.created_at
                      ? new Date(file.created_at).toLocaleDateString()
                      : "UPLOADED"}
                  </small>
                </div>

                <div className="admin-media-card-actions">
                  <button
                    type="button"
                    onClick={() => void copyUrl(file.publicUrl)}
                  >
                    COPY URL
                  </button>

                  <a
                    href={file.publicUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    OPEN
                  </a>

                  <button
                    type="button"
                    onClick={() => void deleteFile(file)}
                  >
                    DELETE
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
