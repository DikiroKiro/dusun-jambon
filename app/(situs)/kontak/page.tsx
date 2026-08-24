import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { linkWhatsApp } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kontak",
  description:
    "Kontak kantor Padukuhan Jambon — alamat, WhatsApp, email, jam layanan, dan peta lokasi.",
};

export default async function KontakPage() {
  const site = await prisma.siteConfig.findUnique({ where: { id: 1 } });

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
      <SectionHeading
        label="Kontak"
        title="Hubungi Kami"
        description="Sampaikan kebutuhan atau pertanyaanmu kepada perangkat padukuhan."
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <Reveal className="space-y-4 lg:col-span-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-hijau-100">
            <h2 className="mb-4 font-serif text-lg font-semibold text-hijau-950">
              Kantor Padukuhan
            </h2>
            <ul className="space-y-3 text-sm text-stone-600">
              <li className="flex gap-3">
                <span className="shrink-0 text-hijau-700">📍</span>
                <span>{site?.alamatKantor}</span>
              </li>
              {site?.jamLayanan && (
                <li className="flex gap-3">
                  <span className="shrink-0 text-hijau-700">🕐</span>
                  <span>{site.jamLayanan}</span>
                </li>
              )}
              {site?.noWhatsApp && (
                <li className="flex gap-3">
                  <span className="shrink-0 text-hijau-700">💬</span>
                  <a
                    href={linkWhatsApp(site.noWhatsApp, "Halo, saya ingin bertanya tentang layanan desa.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-hijau-700 hover:text-hijau-900"
                  >
                    {site.noWhatsApp.replace("62", "0")}
                  </a>
                </li>
              )}
              {site?.emailDesa && (
                <li className="flex gap-3">
                  <span className="shrink-0 text-hijau-700">✉️</span>
                  <a
                    href={`mailto:${site.emailDesa}`}
                    className="font-medium text-hijau-700 hover:text-hijau-900"
                  >
                    {site.emailDesa}
                  </a>
                </li>
              )}
            </ul>
            {site?.noWhatsApp && (
              <a
                href={linkWhatsApp(site.noWhatsApp, "Halo, saya ingin bertanya tentang layanan desa.")}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-hijau-700 px-5 py-2.5 text-sm font-semibold text-krem-50 transition-all hover:bg-hijau-800 active:scale-[0.97] active:brightness-90"
              >
                Chat WhatsApp
              </a>
            )}
          </div>

          <div className="rounded-2xl bg-hijau-800 p-6 text-krem-50">
            <h2 className="mb-2 font-serif text-lg font-semibold text-emas-200">
              Jam Layanan
            </h2>
            <p className="text-sm leading-relaxed text-krem-100/90">
              {site?.jamLayanan ??
                "Senin – Jumat, 08.00 – 14.00 WIB"}
            </p>
            <p className="mt-3 text-xs leading-relaxed text-krem-100/60">
              Untuk pengurusan surat, mohon membawa dokumen persyaratan sesuai
              informasi pada halaman Layanan.
            </p>
          </div>
        </Reveal>

        <Reveal delay={150} className="overflow-hidden rounded-2xl shadow-md ring-1 ring-hijau-100 lg:col-span-3">
          {site?.mapsEmbedUrl ? (
            <iframe
              src={site.mapsEmbedUrl}
              title={`Peta lokasi ${site.namaDesa}`}
              className="h-full min-h-[420px] w-full"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="flex h-full min-h-[420px] items-center justify-center bg-hijau-100 font-serif text-2xl text-hijau-400">
              Peta belum tersedia
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
