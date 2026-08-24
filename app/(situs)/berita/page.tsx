import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { BeritaCard } from "@/components/berita/BeritaCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Berita",
  description:
    "Berita dan kabar kegiatan terbaru dari Padukuhan Jambon, Hargomulyo, Gedangsari.",
};

export default async function BeritaPage() {
  const berita = await prisma.berita.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
      <SectionHeading
        label="Kabar Desa"
        title="Berita & Kegiatan"
        description="Informasi terbaru seputar kegiatan dan perkembangan di Padukuhan Jambon."
      />

      {berita.length === 0 ? (
        <p className="rounded-2xl bg-white p-10 text-center text-sm text-stone-500 ring-1 ring-hijau-100">
          Belum ada berita. Mohon kembali lagi nanti.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {berita.map((b, i) => (
            <Reveal key={b.id} delay={(i % 3) * 100}>
              <BeritaCard
                judul={b.judul}
                slug={b.slug}
                ringkasan={b.ringkasan}
                coverFoto={b.coverFoto}
                publishedAt={b.publishedAt}
              />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
