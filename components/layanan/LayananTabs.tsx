"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export type EntryLayanan = {
  kategori: string;
  judul: string;
  isi: string;
};

const LABEL_KATEGORI: Record<string, string> = {
  SURAT: "Surat & Administrasi",
  PROGRAM: "Program",
  POSYANDU: "Posyandu",
  KONTAK: "Kontak",
  UMUM: "Informasi Umum",
};

const URUTAN_KATEGORI = ["SURAT", "PROGRAM", "POSYANDU", "KONTAK", "UMUM"];

export function LayananTabs({ entries }: { entries: EntryLayanan[] }) {
  const kategoriTersedia = URUTAN_KATEGORI.filter((k) =>
    entries.some((e) => e.kategori === k)
  );
  const [aktif, setAktif] = useState(kategoriTersedia[0] ?? "SURAT");
  const [terbuka, setTerbuka] = useState<string | null>(null);

  const daftar = entries.filter((e) => e.kategori === aktif);

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {kategoriTersedia.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => {
              setAktif(k);
              setTerbuka(null);
            }}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              aktif === k
                ? "bg-hijau-800 text-krem-50"
                : "bg-white text-stone-600 ring-1 ring-hijau-200 hover:bg-hijau-100"
            )}
          >
            {LABEL_KATEGORI[k] ?? k}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {daftar.length === 0 && (
          <p className="rounded-2xl bg-white p-6 text-sm text-stone-500 ring-1 ring-hijau-100">
            Belum ada informasi untuk kategori ini.
          </p>
        )}
        {daftar.map((entry) => {
          const buka = terbuka === entry.judul;
          return (
            <div
              key={entry.judul}
              className="overflow-hidden rounded-2xl bg-white ring-1 ring-hijau-100"
            >
              <button
                type="button"
                onClick={() => setTerbuka(buka ? null : entry.judul)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="font-serif text-base font-semibold text-hijau-950">
                  {entry.judul}
                </span>
                <span
                  className={cn(
                    "shrink-0 text-hijau-700 transition-transform",
                    buka && "rotate-180"
                  )}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </span>
              </button>
              {buka && (
                <div className="whitespace-pre-line border-t border-hijau-100 px-5 py-4 text-sm leading-relaxed text-stone-600">
                  {entry.isi}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
