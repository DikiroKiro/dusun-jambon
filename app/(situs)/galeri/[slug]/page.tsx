import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatTanggal, uploadUrl } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";
import { PhotoGrid } from "@/components/galeri/PhotoGrid";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const album = await prisma.album.findUnique({
    where: { slug },
    select: { judul: true, deskripsi: true },
  });
  if (!album) return { title: "Album tidak ditemukan" };
  return {
    title: album.judul,
    description: album.deskripsi ?? `Album ${album.judul} Padukuhan Jambon.`,
  };
}

export async function generateStaticParams() {
  const albums = await prisma.album.findMany({
    select: { slug: true },
  });
  return albums.map((a) => ({ slug: a.slug }));
}

export default async function AlbumDetailPage({ params }: Props) {
  const { slug } = await params;
  const album = await prisma.album.findUnique({
    where: { slug },
    include: { photos: { orderBy: { urutan: "asc" } } },
  });

  if (!album) notFound();

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
      <nav className="mb-6 text-sm text-stone-500">
        <Link href="/galeri" className="hover:text-hijau-700">
          Galeri
        </Link>
        <span className="mx-2">/</span>
        <span className="font-medium text-hijau-900">{album.judul}</span>
      </nav>

      <Reveal className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-hijau-950">
          {album.judul}
        </h1>
        {album.deskripsi && (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-stone-600 sm:text-base">
            {album.deskripsi}
          </p>
        )}
        {album.tanggal && (
          <p className="mt-2 text-xs text-stone-400">{formatTanggal(album.tanggal)}</p>
        )}
      </Reveal>

      {album.photos.length === 0 ? (
        <p className="rounded-2xl bg-white p-10 text-center text-sm text-stone-500 ring-1 ring-hijau-100">
          Album ini belum memiliki foto.
        </p>
      ) : (
        <PhotoGrid
          photos={album.photos.map((p) => ({
            src: uploadUrl(p.path) ?? "",
            caption: p.caption,
          }))}
        />
      )}
    </section>
  );
}
