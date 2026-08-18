import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatTanggalSingkat } from "@/lib/utils";
import { StatusBadge } from "@/components/admin/StatusBadge";

export default async function AdminDashboardPage() {
  const [beritaTotal, beritaTerbit, album, foto, kb] = await Promise.all([
    prisma.berita.count(),
    prisma.berita.count({ where: { status: "PUBLISHED" } }),
    prisma.album.count(),
    prisma.photo.count(),
    prisma.kbEntry.count({ where: { aktif: true } }),
  ]);

  const terbaru = await prisma.berita.findMany({
    orderBy: { updatedAt: "desc" },
    take: 5,
  });

  const kartu = [
    { label: "Berita", nilai: `${beritaTerbit} terbit / ${beritaTotal} total`, href: "/admin/berita" },
    { label: "Album galeri", nilai: `${album} album · ${foto} foto`, href: "/admin/galeri" },
    { label: "Pengetahuan chatbot", nilai: `${kb} aktif`, href: "/admin/kb" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-hijau-950">Dashboard</h1>
        <p className="text-sm text-stone-500">
          Ringkasan konten situs Padukuhan Jambon.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kartu.map((k) => (
          <Link
            key={k.label}
            href={k.href}
            className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200 transition-shadow hover:shadow-md"
          >
            <p className="text-sm font-semibold text-stone-500">{k.label}</p>
            <p className="mt-1 text-lg font-bold text-hijau-800">{k.nilai}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-lg font-bold text-hijau-950">
            Berita terbaru
          </h2>
          <Link
            href="/admin/berita/baru"
            className="rounded-lg bg-hijau-800 px-4 py-2 text-sm font-semibold text-krem-50 transition-colors hover:bg-hijau-900"
          >
            + Tulis berita
          </Link>
        </div>
        {terbaru.length === 0 ? (
          <p className="py-6 text-center text-sm text-stone-400">
            Belum ada berita. Mulai tulis berita pertama desa!
          </p>
        ) : (
          <ul className="divide-y divide-stone-100">
            {terbaru.map((b) => (
              <li key={b.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-stone-800">
                    {b.judul}
                  </p>
                  <p className="text-xs text-stone-400">
                    {formatTanggalSingkat(b.publishedAt ?? b.createdAt)}
                  </p>
                </div>
                <StatusBadge status={b.status} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
