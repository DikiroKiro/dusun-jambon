"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Input, Textarea, ErrorNote, btnPrimer, btnNetral } from "./FormControls";
import { UploadField } from "./UploadField";
import { DeleteButton } from "./DeleteButton";
import { uploadUrl } from "@/lib/utils";

export type AwalAlbum = {
  judul: string;
  slug: string;
  deskripsi: string | null;
  tanggal: Date | null;
};

export type FotoLama = {
  id: string;
  path: string;
  caption: string | null;
};

type BarisFoto = { key: number; path: string };

type Props = {
  action: (prev: { error?: string }, fd: FormData) => Promise<{ error?: string }>;
  hapusFoto?: (id: string) => void | Promise<void>;
  awal?: AwalAlbum;
  fotosLama?: FotoLama[];
};

export function AlbumForm({ action, hapusFoto, awal, fotosLama = [] }: Props) {
  const [state, formAction] = useActionState(action, { error: undefined });
  const [baris, setBaris] = useState<BarisFoto[]>([]);
  const tgl = awal?.tanggal ? new Date(awal.tanggal).toISOString().slice(0, 10) : "";

  function tambahFoto() {
    setBaris((b) => [...b, { key: Date.now(), path: "" }]);
  }

  function hapusBaris(key: number, path: string) {
    if (path) {
      fetch(`/api/upload?path=${encodeURIComponent(path)}`, {
        method: "DELETE",
      }).catch(() => undefined);
    }
    setBaris((b) => b.filter((x) => x.key !== key));
  }

  return (
    <form action={formAction} className="space-y-5">
      <ErrorNote pesan={state.error} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          name="judul"
          label="Judul album"
          required
          placeholder="Misal: Gotong Royong Bersih Desa"
          defaultValue={awal?.judul}
        />
        <Input
          type="date"
          name="tanggal"
          label="Tanggal kegiatan (opsional)"
          defaultValue={tgl}
        />
      </div>
      <Input
        name="slug"
        label="Slug (otomatis)"
        hint="Otomatis dibuat dari judul; jangan diubah manual."
        defaultValue={awal?.slug}
        disabled
      />
      <Textarea
        name="deskripsi"
        label="Deskripsi album (opsional)"
        rows={3}
        defaultValue={awal?.deskripsi ?? ""}
      />

      {fotosLama.length > 0 && (
        <div>
          <span className="mb-2 block text-sm font-medium text-stone-700">
            Foto yang sudah ada
          </span>
          <div className="grid gap-3 sm:grid-cols-2">
            {fotosLama.map((f) => (
              <div
                key={f.id}
                className="flex items-center gap-3 rounded-lg border border-stone-200 bg-white p-3"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={uploadUrl(f.path) ?? ""}
                  alt={f.caption ?? "Foto album"}
                  className="h-16 w-24 shrink-0 rounded-md object-cover ring-1 ring-stone-200"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-stone-600">
                    {f.caption || "Tanpa keterangan"}
                  </p>
                </div>
                {hapusFoto && (
                  <DeleteButton action={() => hapusFoto(f.id)} pesan="Hapus foto ini?" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <span className="mb-2 block text-sm font-medium text-stone-700">
          Tambah foto baru
        </span>
        {baris.length === 0 ? (
          <p className="mb-3 text-sm text-stone-400">
            Belum ada foto baru ditambahkan.
          </p>
        ) : (
          <div className="space-y-4">
            {baris.map((b) => (
              <div
                key={b.key}
                className="rounded-lg border border-stone-200 bg-white p-4"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <UploadField
                    name="fotos[]"
                    folder="galeri"
                    label="Pilih gambar"
                  />
                  <button
                    type="button"
                    onClick={() => hapusBaris(b.key, b.path)}
                    className="shrink-0 rounded-md border border-stone-300 px-3 py-1.5 text-xs font-semibold text-stone-600 hover:bg-stone-100"
                  >
                    Batal
                  </button>
                </div>
                <Input
                  name="captions[]"
                  label="Keterangan foto (opsional)"
                  placeholder="Misal: Warga bergotong royong membersihkan balai"
                />
              </div>
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={tambahFoto}
          className="mt-3 rounded-lg border border-dashed border-hijau-400 px-4 py-2.5 text-sm font-semibold text-hijau-700 transition-colors hover:bg-hijau-50"
        >
          + Tambah foto
        </button>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" className={btnPrimer}>
          Simpan Album
        </button>
        <Link href="/admin/galeri" className={btnNetral}>
          Batal
        </Link>
      </div>
    </form>
  );
}
