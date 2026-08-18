import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { linkWhatsApp } from "@/lib/utils";

export async function Footer() {
  const site = await prisma.siteConfig.findUnique({ where: { id: 1 } });

  return (
    <footer className="bg-hijau-950 text-krem-100">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="mb-3 font-serif text-lg font-semibold text-emas-200">
            {site?.namaDesa ?? "Padukuhan Jambon"}
          </h3>
          <p className="text-sm leading-relaxed text-krem-100/70">
            Tentrem, Mulya, Lan Makmur.
            <br />
            {site?.alamatKantor}
          </p>
        </div>

        <div>
          <h3 className="mb-3 font-serif text-lg font-semibold text-emas-200">
            Menu
          </h3>
          <ul className="space-y-2 text-sm text-krem-100/70">
            <li><Link className="hover:text-emas-200" href="/profil">Profil Desa</Link></li>
            <li><Link className="hover:text-emas-200" href="/berita">Berita</Link></li>
            <li><Link className="hover:text-emas-200" href="/umkm">UMKM</Link></li>
            <li><Link className="hover:text-emas-200" href="/galeri">Galeri</Link></li>
            <li><Link className="hover:text-emas-200" href="/layanan">Layanan</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-serif text-lg font-semibold text-emas-200">
            Layanan
          </h3>
          <ul className="space-y-2 text-sm text-krem-100/70">
            <li>Surat Keterangan Domisili</li>
            <li>Kartu Keluarga & KTP</li>
            <li>Akta Kelahiran & Kematian</li>
            <li>Jadwal Posyandu Sindoro</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-serif text-lg font-semibold text-emas-200">
            Hubungi Kami
          </h3>
          <ul className="space-y-2 text-sm text-krem-100/70">
            {site?.noWhatsApp && (
              <li>
                <a
                  href={linkWhatsApp(site.noWhatsApp, "Halo, saya ingin bertanya tentang layanan desa.")}
                  className="hover:text-emas-200"
                >
                  WhatsApp: {site.noWhatsApp.replace("62", "0").replace(/^(\d{4})(\d{4})(\d{4})$/, "$1-$2-$3") || site.noWhatsApp}
                </a>
              </li>
            )}
            {site?.emailDesa && (
              <li>
                <a href={`mailto:${site.emailDesa}`} className="hover:text-emas-200">
                  {site.emailDesa}
                </a>
              </li>
            )}
            {site?.jamLayanan && <li>{site.jamLayanan}</li>}
          </ul>
        </div>
      </div>

      <div className="border-t border-hijau-800/60 py-4 text-center text-xs text-krem-100/50">
        © {new Date().getFullYear()} Padukuhan Jambon · Hargomulyo, Gedangsari, Gunungkidul, DI Yogyakarta
      </div>
    </footer>
  );
}
