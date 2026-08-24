import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { UmkmCard } from "@/components/umkm/UmkmCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "UMKM",
  description:
    "Daftar UMKM Padukuhan Jambon — produk olahan lokal karya warga yang siap dipesan via WhatsApp.",
};

export default async function UmkmPage() {
  const umkm = await prisma.umkm.findMany({
    where: { aktif: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
      <SectionHeading
        label="UMKM"
        title="UMKM Padukuhan Jambon"
        description="Produk olahan lokal hasil karya warga. Pesan langsung melalui WhatsApp!"
      />

      {umkm.length === 0 ? (
        <p className="rounded-2xl bg-white p-10 text-center text-sm text-stone-500 ring-1 ring-hijau-100">
          Belum ada UMKM terdaftar.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {umkm.map((u, i) => (
            <Reveal key={u.id} delay={i * 120}>
              <UmkmCard
                nama={u.nama}
                pemilik={u.pemilik}
                deskripsi={u.deskripsi}
                noWhatsApp={u.noWhatsApp}
                alamat={u.alamat}
                foto={u.foto}
              />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
