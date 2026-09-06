"use client";
/* eslint-disable @next/next/no-img-element -- authenticated user media allows arbitrary Supabase project hosts. */

import { useMemo, useState } from "react";
import { ImageIcon, Search, Trash2, Upload } from "lucide-react";

export type MediaItem = {
  id: string;
  public_url: string;
  storage_path: string;
  mime_type: string;
  file_size: number;
  width: number | null;
  height: number | null;
  alt_text: string | null;
  created_at: string;
};

export function MediaManager({
  siteId,
  initialMedia,
}: {
  siteId: string;
  initialMedia: MediaItem[];
}) {
  const [items, setItems] = useState(initialMedia);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const filtered = useMemo(
    () =>
      items.filter((item) =>
        `${item.storage_path} ${item.alt_text ?? ""}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [items, query],
  );
  async function upload(file: File) {
    setStatus("Uploading…");
    const form = new FormData();
    form.set("siteId", siteId);
    form.set("file", file);
    const response = await fetch("/api/media", { method: "POST", body: form });
    const body = (await response.json()) as {
      id?: string;
      url?: string;
      error?: string;
    };
    if (!response.ok || !body.id || !body.url)
      return setStatus(body.error ?? "Upload failed.");
    const image = new Image();
    image.onload = async () => {
      await fetch("/api/media", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          id: body.id,
          width: image.naturalWidth,
          height: image.naturalHeight,
        }),
      });
    };
    image.src = body.url;
    setItems((current) => [
      {
        id: body.id!,
        public_url: body.url!,
        storage_path: file.name,
        mime_type: file.type,
        file_size: file.size,
        width: null,
        height: null,
        alt_text: null,
        created_at: new Date().toISOString(),
      },
      ...current,
    ]);
    setStatus("Upload complete.");
  }
  async function updateAlt(id: string, altText: string) {
    const response = await fetch("/api/media", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id, altText }),
    });
    const body = (await response.json()) as { error?: string };
    setStatus(
      response.ok
        ? "Alt text saved."
        : (body.error ?? "Could not save alt text."),
    );
    if (response.ok)
      setItems((current) =>
        current.map((item) =>
          item.id === id ? { ...item, alt_text: altText } : item,
        ),
      );
  }
  async function remove(id: string) {
    if (!confirm("Delete this unused image permanently?")) return;
    const response = await fetch(`/api/media?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    const body = (await response.json()) as { error?: string };
    setStatus(
      response.ok
        ? "Image deleted."
        : (body.error ?? "Could not delete image."),
    );
    if (response.ok)
      setItems((current) => current.filter((item) => item.id !== id));
  }
  return (
    <div className="mt-8">
      <div className="glass flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <Search className="absolute left-3 top-3 text-white/35" size={17} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by filename or alt text"
            className="min-h-10 w-full rounded-xl border border-white/10 bg-white/[.05] pl-10 pr-3 text-sm outline-none focus:border-[#FFC857]"
          />
        </label>
        <label className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#F5A623] px-4 text-sm font-semibold text-[#173028]">
          <Upload size={16} /> Upload images
          <input
            className="sr-only"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            multiple
            onChange={(event) =>
              Array.from(event.target.files ?? []).forEach(upload)
            }
          />
        </label>
      </div>
      {status && (
        <p className="mt-3 text-sm text-white/50" aria-live="polite">
          {status}
        </p>
      )}
      {filtered.length ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <article
              className="glass overflow-hidden rounded-2xl"
              key={item.id}
            >
              <div className="aspect-[4/3] bg-black/20">
                <img
                  src={item.public_url}
                  alt={item.alt_text ?? ""}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-4">
                <p className="truncate text-xs text-white/40">
                  {item.storage_path.split("/").at(-1)}
                </p>
                <p className="mt-1 text-xs text-white/30">
                  {item.width && item.height
                    ? `${item.width} × ${item.height} · `
                    : ""}
                  {formatBytes(item.file_size)}
                </p>
                <label className="mt-4 block text-xs text-white/55">
                  Alternative text
                  <input
                    defaultValue={item.alt_text ?? ""}
                    onBlur={(event) => updateAlt(item.id, event.target.value)}
                    className="mt-2 min-h-10 w-full rounded-xl border border-white/10 bg-white/[.05] px-3 text-sm outline-none focus:border-[#FFC857]"
                  />
                </label>
                <button
                  onClick={() => remove(item.id)}
                  className="mt-3 inline-flex items-center gap-2 text-xs text-red-200"
                >
                  <Trash2 size={14} /> Delete unused image
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="glass mt-6 grid min-h-64 place-items-center rounded-3xl text-center">
          <div>
            <ImageIcon className="mx-auto text-[#FFC857]" />
            <h2 className="mt-4 text-lg font-semibold">No matching media</h2>
            <p className="mt-2 text-sm text-white/40">
              Upload JPG, PNG, WebP or AVIF images up to 10 MB.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export function MediaUploadField({
  siteId,
  name,
  defaultValue = "",
  label = "Featured image",
}: {
  siteId: string;
  name: string;
  defaultValue?: string;
  label?: string;
}) {
  const [url, setUrl] = useState(defaultValue);
  const [status, setStatus] = useState("");
  async function upload(file: File) {
    setStatus("Uploading…");
    const form = new FormData();
    form.set("siteId", siteId);
    form.set("file", file);
    const response = await fetch("/api/media", { method: "POST", body: form });
    const body = (await response.json()) as { url?: string; error?: string };
    if (response.ok && body.url) {
      setUrl(body.url);
      setStatus("Uploaded.");
    } else setStatus(body.error ?? "Upload failed.");
  }
  return (
    <label className="text-sm text-white/70 sm:col-span-2">
      {label}
      <input type="hidden" name={name} value={url} />
      <span className="mt-2 flex flex-col gap-3 rounded-2xl border border-white/10 p-3 sm:flex-row sm:items-center">
        {url && (
          <>
            <img
              src={url}
              alt="Selected upload"
              className="h-20 w-28 rounded-xl object-cover"
            />
          </>
        )}
        <span className="flex-1 truncate text-xs text-white/40">
          {status || url || "No image selected"}
        </span>
        <span className="inline-flex min-h-10 cursor-pointer items-center justify-center rounded-xl bg-white/10 px-3 text-sm">
          Choose image
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="sr-only"
            onChange={(event) =>
              event.target.files?.[0] && upload(event.target.files[0])
            }
          />
        </span>
      </span>
    </label>
  );
}

function formatBytes(bytes: number) {
  return bytes < 1024 * 1024
    ? `${Math.round(bytes / 1024)} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
