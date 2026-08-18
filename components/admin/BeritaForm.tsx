"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Input, Textarea, Select, ErrorNote, btnPrimer, btnNetral } from "./FormControls";
import { UploadField } from "./UploadField";

export type AwalBerita = {
  judul: string;
  slug: string;
  ringkasan: string | null;
  konten: string;
  coverFoto: string | null;
  penulis: string | null;
  status: string;
  publishedAt: Date | null;
};

type Props = {
  action: (prev: { error?: string }, fd: FormData) => Promise<{ error?: string }>;
  awal?: AwalBerita;
};

export function BeritaForm({ action, awal }: Props) {
  const [state, formAction] = useActionState(action, { error: undefined });
  const dt = awal?.publishedAt
    ? new Date(awal.publishedAt).toISOString().slice(0, 16)
    : "";

  return (
    <form action={formAction} className="space-y-5">
      <ErrorNote pesan={state.error} />

      <Input
        name="judul"
        label="Judul berita"
        required
        placeholder="Misal: Peringatan Hari Kemerdekaan ke-81"
        defaultValue={awal?.judul}
      />
      <Input
        name="slug"
        label="Slug (otomatis)"
        hint="Otomatis dibuat dari judul; jangan diubah manual."
        defaultValue={awal?.slug}
        disabled
      />
      <Textarea
        name="ringkasan"
        label="Ringkasan"
        hint="Ringkas singkat yang tampil di kartu berita (maks 300 karakter)."
        rows={2}
        maxLength={300}
        defaultValue={awal?.ringkasan ?? ""}
      />
      <Textarea
        name="konten"
        label="Isi berita"
        rows={10}
        required
        hint="Ganti baris untuk membuat paragraf baru."
        defaultValue={awal?.konten}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <Input name="penulis" label="Penulis" defaultValue={awal?.penulis ?? ""} />
        <Select name="status" label="Status" defaultValue={awal?.status ?? "DRAFT"}>
          <option value="DRAFT">Draft (belum tampil)</option>
          <option value="PUBLISHED">Terbit (langsung tampil)</option>
        </Select>
      </div>
      <Input
        type="datetime-local"
        name="publishedAt"
        label="Tanggal terbit"
        hint="Kosongkan untuk memakai tanggal sekarang saat diterbitkan."
        defaultValue={dt}
      />
      <UploadField
        name="coverFoto"
        folder="berita"
        label="Gambar sampul (opsional)"
        existing={awal?.coverFoto}
      />

      <div className="flex gap-3 pt-2">
        <button type="submit" className={btnPrimer}>
          Simpan Berita
        </button>
        <Link href="/admin/berita" className={btnNetral}>
          Batal
        </Link>
      </div>
    </form>
  );
}
