import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatTanggalSingkat, uploadUrl } from "@/lib/utils";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { hapusBerita } from "@/lib/actions-admin";

export default async function AdminBeritaPage() {
  const daftar = await prisma.berita.findMany({
    orderBy: { updatedAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-bold text-hijau-950">Berita</h1>
          <p className="text-sm text-stone-500">
            Kelola berita desa. Status &quot;Terbit&quot; tampil di situs.
          </p>
        </div>
        <Link
          href="/admin/berita/baru"
          className="rounded-lg bg-hijau-800 px-4 py-2.5 text-sm font-semibold text-krem-50 transition-colors hover:bg-hijau-900"
        >
          + Tulis berita
        </Link>
      </div>

      {daftar.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-stone-200">
          <p className="text-sm text-stone-500">
            Belum ada berita. Klik &quot;+ Tulis berita&quot; untuk membuat yang pertama.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200">
          <ul className="divide-y divide-stone-100">
            {daftar.map((b) => (
              <li key={b.id} className="flex items-center gap-4 px-4 py-3">
                <div className="h-12 w-20 shrink-0 overflow-hidden rounded-lg bg-stone-100 ring-1 ring-stone-200">
                  {b.coverFoto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={uploadUrl(b.coverFoto) ?? ""}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-lg text-stone-300">
                      📰
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-stone-800">
                    {b.judul}
                  </p>
                  <p className="text-xs text-stone-400">
                    {formatTanggalSingkat(b.publishedAt ?? b.createdAt)} · /berita/{b.slug}
                  </p>
                </div>
                <StatusBadge status={b.status} />
                <div className="flex shrink-0 items-center gap-2">
                  <Link
                    href={`/admin/berita/${b.id}`}
                    className="rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-semibold text-stone-700 transition-colors hover:bg-stone-50"
                  >
                    Edit
                  </Link>
                  <DeleteButton
                    action={hapusBerita.bind(null, b.id)}
                    pesan={`Hapus berita "${b.judul}"?`}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
