import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { LayananTabs } from "@/components/layanan/LayananTabs";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Layanan",
  description:
    "Informasi layanan administrasi kependudukan, program, posyandu, dan kontak di Padukuhan Jambon.",
};

export default async function LayananPage() {
  const [site, entries] = await Promise.all([
    prisma.siteConfig.findUnique({ where: { id: 1 } }),
    prisma.kbEntry.findMany({
      where: { aktif: true },
      orderBy: { updatedAt: "desc" },
      select: { kategori: true, judul: true, isi: true },
    }),
  ]);

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:py-20">
      <SectionHeading
        label="Layanan"
        title="Layanan Padukuhan Jambon"
        description={
          site?.jamLayanan
            ? `Jam layanan: ${site.jamLayanan}. Pilih kategori untuk melihat informasi lengkap.`
            : "Pilih kategori untuk melihat informasi lengkap."
        }
      />
      <Reveal>
        <LayananTabs entries={entries} />
      </Reveal>
    </section>
  );
}
