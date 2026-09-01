"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

const MENU = [
  { href: "/", label: "Beranda" },
  { href: "/profil", label: "Profil" },
  { href: "/berita", label: "Berita" },
  { href: "/umkm", label: "UMKM" },
  { href: "/galeri", label: "Galeri" },
  { href: "/layanan", label: "Layanan" },
  { href: "/kontak", label: "Kontak" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-hijau-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-hijau-800 text-lg text-emas-200">
            🌿
          </span>
          <span className="leading-tight">
            <span className="block font-serif text-lg font-semibold text-hijau-900">
              Padukuhan Jambon
            </span>
            <span className="block text-[11px] uppercase tracking-wider text-emas-700">
              Hargomulyo · Gedangsari
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {MENU.map((item) => {
            const aktif =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-sm font-medium transition-all",
                  aktif
                    ? "bg-hijau-800 text-krem-50"
                    : "text-stone-600 hover:bg-hijau-100 hover:text-hijau-900 active:scale-[0.97] active:bg-white/10"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-hijau-200 text-hijau-900 md:hidden"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="border-t border-hijau-100 bg-white px-4 py-3 md:hidden">
          {MENU.map((item) => {
            const aktif =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "block rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  aktif
                    ? "bg-hijau-800 text-krem-50"
                    : "text-stone-700 hover:bg-hijau-100 active:scale-[0.97] active:bg-white/10"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
