import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { AlbumCard } from "@/components/galeri/AlbumCard";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Galeri",
  description: "Album dokumentasi kegiatan dan layanan di Padukuhan Jambon.",
};

export default async function GaleriPage() {
  const albums = await prisma.album.findMany({
    include: {
      photos: { orderBy: { urutan: "asc" } },
      _count: { select: { photos: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
      <SectionHeading
        label="Galeri"
        title="Album Dokumentasi"
        description="Dokumentasi kegiatan dan layanan Padukuhan Jambon dalam beberapa album."
      />

      {albums.length === 0 ? (
        <p className="rounded-2xl bg-white p-10 text-center text-sm text-stone-500 ring-1 ring-hijau-100">
          Belum ada album galeri.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {albums.map((a, i) => (
            <Reveal key={a.id} delay={(i % 3) * 100}>
              <AlbumCard
                judul={a.judul}
                slug={a.slug}
                deskripsi={a.deskripsi}
                tanggal={a.tanggal}
                jumlahFoto={a._count.photos}
                sampul={a.photos[0]?.path ?? null}
              />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
