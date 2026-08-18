import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatTanggalSingkat, uploadUrl } from "@/lib/utils";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { hapusAlbum } from "@/lib/actions-admin";

export default async function AdminGaleriPage() {
  const daftar = await prisma.album.findMany({
    include: { photos: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-bold text-hijau-950">Galeri</h1>
          <p className="text-sm text-stone-500">
            Kelola album dan foto kegiatan desa.
          </p>
        </div>
        <Link
          href="/admin/galeri/baru"
          className="rounded-lg bg-hijau-800 px-4 py-2.5 text-sm font-semibold text-krem-50 transition-colors hover:bg-hijau-900"
        >
          + Buat album
        </Link>
      </div>

      {daftar.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-stone-200">
          <p className="text-sm text-stone-500">
            Belum ada album. Klik &quot;+ Buat album&quot; untuk menambahkan foto.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {daftar.map((a) => (
            <div
              key={a.id}
              className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200"
            >
              <div className="h-36 bg-stone-100">
                {a.photos[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={uploadUrl(a.photos[0].path) ?? ""}
                    alt={a.judul}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-3xl text-stone-300">
                    🖼️
                  </div>
                )}
              </div>
              <div className="p-4">
                <h2 className="truncate font-serif text-base font-bold text-hijau-950">
                  {a.judul}
                </h2>
                <p className="mt-0.5 text-xs text-stone-400">
                  {a.photos.length} foto
                  {a.tanggal ? ` · ${formatTanggalSingkat(a.tanggal)}` : ""}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <Link
                    href={`/admin/galeri/${a.id}`}
                    className="rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-semibold text-stone-700 transition-colors hover:bg-stone-50"
                  >
                    Kelola
                  </Link>
                  <DeleteButton
                    action={hapusAlbum.bind(null, a.id)}
                    pesan={`Hapus album "${a.judul}" beserta ${a.photos.length} fotonya?`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
