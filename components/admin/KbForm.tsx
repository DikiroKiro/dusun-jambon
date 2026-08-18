"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Input, Textarea, Select, ErrorNote, btnPrimer, btnNetral } from "./FormControls";

export type AwalKb = {
  kategori: string;
  judul: string;
  isi: string;
  aktif: boolean;
};

type Props = {
  action: (prev: { error?: string }, fd: FormData) => Promise<{ error?: string }>;
  awal?: AwalKb;
};

const KATEGORI = ["SURAT", "PROGRAM", "POSYANDU", "KONTAK", "UMUM", "LAIN"];

export function KbForm({ action, awal }: Props) {
  const [state, formAction] = useActionState(action, { error: undefined });

  return (
    <form action={formAction} className="space-y-5">
      <ErrorNote pesan={state.error} />

      <Select name="kategori" label="Kategori" defaultValue={awal?.kategori ?? "SURAT"}>
        {KATEGORI.map((k) => (
          <option key={k} value={k}>
            {k}
          </option>
        ))}
      </Select>

      <Input
        name="judul"
        label="Judul / topik"
        required
        placeholder="Misal: Cara membuat surat keterangan domisili"
        defaultValue={awal?.judul}
      />

      <Textarea
        name="isi"
        label="Jawaban"
        rows={8}
        required
        hint="Jawaban ini akan dipakai chatbot Asisten Jambon untuk pertanyaan yang cocok. Ganti baris untuk membuat paragraf baru."
        defaultValue={awal?.isi}
      />

      <label className="flex items-center gap-2 text-sm font-medium text-stone-700">
        <input
          type="checkbox"
          name="aktif"
          defaultChecked={awal?.aktif ?? true}
          className="h-4 w-4 rounded border-stone-300 accent-hijau-700"
        />
        Aktif (dipakai chatbot)
      </label>

      <div className="flex gap-3 pt-2">
        <button type="submit" className={btnPrimer}>
          Simpan
        </button>
        <Link href="/admin/kb" className={btnNetral}>
          Batal
        </Link>
      </div>
    </form>
  );
}
