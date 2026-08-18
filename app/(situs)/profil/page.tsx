import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ringkasMisi, uploadUrl } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { StrukturCard } from "@/components/profil/StrukturCard";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Profil",
  description:
    "Visi misi, sejarah, struktur organisasi, dan wilayah Padukuhan Jambon, Hargomulyo, Gedangsari.",
};

export default async function ProfilPage() {
  const [site, officials] = await Promise.all([
    prisma.siteConfig.findUnique({ where: { id: 1 } }),
    prisma.official.findMany({
      where: { aktif: true },
      orderBy: { urutan: "asc" },
    }),
  ]);

  const misi = site ? ringkasMisi(site.misi) : [];

  return (
    <>
      {/* VISI MISI */}
      <section className="bg-hijau-900 py-16 text-krem-50">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading
            label="Profil"
            title="Visi & Misi"
            className="text-krem-50 [&_h2]:text-krem-50 [&_p]:text-krem-100/70"
            description={`Mengenal lebih dekat ${site?.namaDesa ?? "Padukuhan Jambon"} — arah dan semangat kami melayani warga.`}
          />
          <div className="grid gap-8 lg:grid-cols-2">
            <Reveal>
              <div className="rounded-2xl bg-white/5 p-8 ring-1 ring-white/10">
                <h3 className="mb-4 font-serif text-lg font-semibold text-emas-200">
                  Visi
                </h3>
                <p className="text-sm leading-relaxed text-krem-100/90 sm:text-base">
                  {site?.visi}
                </p>
              </div>
            </Reveal>
            <Reveal delay={150}>
              <div className="rounded-2xl bg-white/5 p-8 ring-1 ring-white/10">
                <h3 className="mb-4 font-serif text-lg font-semibold text-emas-200">
                  Misi
                </h3>
                <ul className="space-y-3">
                  {misi.map((m, i) => (
                    <li key={i} className="flex gap-3 text-sm leading-relaxed text-krem-100/90">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emas-400" />
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* SEJARAH */}
      {site?.sejarah && (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <Reveal>
              <div>
                <SectionHeading label="Sejarah" title={`Sejarah ${site.namaDesa}`} />
                <p className="-mt-4 whitespace-pre-line text-sm leading-relaxed text-stone-600 sm:text-base">
                  {site.sejarah}
                </p>
              </div>
            </Reveal>
            <Reveal delay={150}>
              <div className="overflow-hidden rounded-2xl shadow-md">
                {site.heroFoto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={uploadUrl(site.heroFoto) ?? ""}
                    alt={`Pemandangan ${site.namaDesa}`}
                    className="h-72 w-full object-cover lg:h-96"
                  />
                ) : (
                  <div className="flex h-72 items-center justify-center bg-hijau-100 font-serif text-5xl text-hijau-300 lg:h-96">
                    🌾
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* STRUKTUR */}
      {officials.length > 0 && (
        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4">
            <SectionHeading
              label="Struktur"
              title="Struktur Organisasi"
              description="Pengurus dan kader Padukuhan Jambon yang siap melayani warga."
            />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {officials.map((o, i) => (
                <Reveal key={o.id} delay={(i % 4) * 80}>
                  <StrukturCard nama={o.nama} jabatan={o.jabatan} foto={o.foto} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PETA */}
      {site?.mapsEmbedUrl && (
        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4">
            <SectionHeading label="Lokasi" title="Peta Lokasi" />
            <div className="overflow-hidden rounded-2xl shadow-md ring-1 ring-hijau-100">
              <iframe
                src={site.mapsEmbedUrl}
                title={`Peta lokasi ${site.namaDesa}`}
                className="h-[420px] w-full"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
