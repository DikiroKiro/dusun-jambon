"use client";

import { useRef, useState } from "react";
import { uploadUrl } from "@/lib/utils";

type Props = {
  name: string;
  folder: string;
  label: string;
  hint?: string;
  existing?: string | null;
};

export function UploadField({ name, folder, label, hint, existing }: Props) {
  const [path, setPath] = useState<string | null>(existing ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function pilihFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setError(null);

    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", folder);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.path) {
        setError(json?.error ?? "Gagal mengunggah gambar");
      } else {
        setPath(json.path);
      }
    } catch {
      setError("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  }

  async function hapus() {
    if (path) {
      await fetch(`/api/upload?path=${encodeURIComponent(path)}`, {
        method: "DELETE",
      }).catch(() => undefined);
    }
    setPath(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  const url = uploadUrl(path);

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-stone-700">
        {label}
      </span>

      {url && (
        <div className="mb-3 flex items-start gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt="Pratinjau"
            className="h-28 w-40 rounded-lg object-cover ring-1 ring-stone-200"
          />
          <button
            type="button"
            onClick={hapus}
            className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
          >
            Hapus gambar
          </button>
        </div>
      )}

      <div className="flex items-center gap-3">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:border-hijau-500 hover:text-hijau-700">
          {loading ? "Mengunggah…" : url ? "Ganti gambar" : "Pilih gambar"}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            className="hidden"
            onChange={pilihFile}
            disabled={loading}
          />
        </label>
        <span className="text-xs text-stone-400">Maks 10 MB, otomatis dioptimalkan</span>
      </div>

      {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}
      {hint && !error && <p className="mt-1 text-xs text-stone-400">{hint}</p>}

      <input type="hidden" name={name} value={path ?? ""} />
    </div>
  );
}
