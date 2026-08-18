"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const MENU = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/berita", label: "Berita" },
  { href: "/admin/galeri", label: "Galeri" },
  { href: "/admin/kb", label: "Pengetahuan Chatbot" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2 lg:flex-col">
      {MENU.map((m) => {
        const aktif = m.exact ? pathname === m.href : pathname.startsWith(m.href);
        return (
          <Link
            key={m.href}
            href={m.href}
            className={cn(
              "rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors",
              aktif
                ? "bg-hijau-800 text-krem-50"
                : "bg-white text-stone-700 ring-1 ring-stone-200 hover:bg-hijau-50"
            )}
          >
            {m.label}
          </Link>
        );
      })}
    </nav>
  );
}
