import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AlbumForm } from "@/components/admin/AlbumForm";
import { ubahAlbum, hapusFoto } from "@/lib/actions-admin";

export default async function AdminGaleriEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const album = await prisma.album.findUnique({
    where: { id },
    include: { photos: { orderBy: { urutan: "asc" } } },
  });
  if (!album) notFound();

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/admin/galeri" className="text-sm font-semibold text-hijau-700 hover:text-hijau-900">
          ← Daftar album
        </Link>
        <h1 className="font-serif text-2xl font-bold text-hijau-950">Kelola album</h1>
      </div>
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
        <AlbumForm
          action={ubahAlbum.bind(null, album.id)}
          hapusFoto={hapusFoto.bind(null)}
          awal={album}
          fotosLama={album.photos}
        />
      </div>
    </div>
  );
}
