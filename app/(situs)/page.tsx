import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { uploadUrl, excerpt, linkWhatsApp } from "@/lib/utils";
import { StatCard } from "@/components/ui/StatCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BeritaCard } from "@/components/berita/BeritaCard";
import { UmkmCard } from "@/components/umkm/UmkmCard";
import { AlbumCard } from "@/components/galeri/AlbumCard";
import { Reveal } from "@/components/ui/Reveal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Beranda",
  description:
    "Padukuhan Jambon, Hargomulyo, Gedangsari, Gunungkidul — informasi profil, berita, UMKM, dan layanan desa.",
};

export default async function HomePage() {
  const [site, statistik, berita, umkm, albums] = await Promise.all([
    prisma.siteConfig.findUnique({ where: { id: 1 } }),
    prisma.statistik.findMany({ orderBy: { urutan: "asc" } }),
    prisma.berita.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: 3,
    }),
    prisma.umkm.findMany({ where: { aktif: true }, take: 2 }),
    prisma.album.findMany({
      include: {
        photos: { orderBy: { urutan: "asc" }, take: 1 },
        _count: { select: { photos: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 2,
    }),
  ]);

  return (
    <>
      {/* HERO */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
        {site?.heroFoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={uploadUrl(site.heroFoto) ?? ""}
            alt={`Pemandangan ${site.namaDesa}`}
            className="absolute inset-0 h-full w-full object-cover [mask-image:linear-gradient(to_bottom,black_90%,transparent)]"
          />
        ) : (
          <div className="absolute inset-0 bg-hijau-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-hijau-950/70 via-hijau-950/55 to-transparent" />

        <div className="relative z-10 mx-auto max-w-3xl px-4 py-20 text-center text-krem-50">
          <p className="animate-fade-in-up mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-emas-300 [animation-delay:100ms]">
            Hargomulyo · Gedangsari · Gunungkidul
          </p>
          <h1 className="animate-fade-in-up font-serif text-4xl font-bold leading-tight sm:text-6xl [animation-delay:200ms]">
            {site?.namaDesa ?? "Padukuhan Jambon"}
          </h1>
          <p className="animate-fade-in-up mt-4 font-serif text-xl italic text-emas-200 sm:text-2xl [animation-delay:300ms]">
            Tentrem, Mulya, Lan Makmur
          </p>
          <p className="animate-fade-in-up mx-auto mt-4 max-w-xl text-sm leading-relaxed text-krem-100/80 sm:text-base [animation-delay:400ms]">
            Profil dan informasi resmi Padukuhan Jambon — layanan administrasi,
            berita kegiatan, UMKM, hingga dokumentasi galeri.
          </p>
          <div className="animate-fade-in-up mt-8 flex flex-wrap justify-center gap-3 [animation-delay:500ms]">
            <Link
              href="/profil"
              className="rounded-full bg-emas-500 px-6 py-3 text-sm font-semibold text-hijau-950 shadow-lg transition-all hover:bg-emas-400 active:scale-[0.97] active:brightness-90"
            >
              Kenali Desa Kami
            </Link>
            <Link
              href="/layanan"
              className="rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-krem-50 ring-1 ring-white/40 backdrop-blur transition-all hover:bg-white/20 active:scale-[0.97] active:bg-white/30"
            >
              Lihat Layanan
            </Link>
          </div>
        </div>
      </section>

      {/* STATISTIK */}
      {statistik.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {statistik.map((s, i) => (
              <Reveal key={s.id} delay={i * 70}>
                <StatCard label={s.label} nilai={s.nilai} tahun={s.tahun} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* PROFIL SINGKAT */}
      {site && (site.sejarah || site.visi) && (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <Reveal direction="left">
              <div>
                <SectionHeading
                  label="Profil"
                  title={`Sekilas ${site.namaDesa}`}
                />
                <p className="-mt-4 text-sm leading-relaxed text-stone-600 sm:text-base">
                  {excerpt(site.sejarah ?? site.visi, 320)}
                </p>
                <Link
                  href="/profil"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-hijau-800 px-6 py-3 text-sm font-semibold text-krem-50 transition-all hover:bg-hijau-900 active:scale-[0.97] active:brightness-90"
                >
                  Selengkapnya
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </Reveal>
            <Reveal direction="right" delay={150}>
              <div className="rounded-2xl bg-hijau-800 p-8 text-krem-50 shadow-lg">
              <h3 className="mb-4 font-serif text-lg font-semibold text-emas-200">
                Visi
              </h3>
              <p className="text-sm leading-relaxed text-krem-100/90 sm:text-base">
                {site.visi}
              </p>
              <h3 className="mb-3 mt-8 font-serif text-lg font-semibold text-emas-200">
                Misi
              </h3>
              <ul className="space-y-2">
                {site.misi
                  .split("\n")
                  .map((m) => m.trim())
                  .filter(Boolean)
                  .map((m, i) => (
                    <li key={i} className="flex gap-3 text-sm leading-relaxed text-krem-100/90">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emas-400" />
                      {m}
                    </li>
                  ))}
              </ul>
            </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* BERITA TERBARU */}
      {berita.length > 0 && (
        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4">
            <SectionHeading
              label="Kabar Desa"
              title="Berita Terbaru"
              description="Kegiatan dan informasi terbaru dari Padukuhan Jambon."
            />
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
            <div className="mt-8 text-center">
              <Link
                href="/berita"
                className="inline-flex items-center gap-2 rounded-full border-2 border-hijau-800 px-6 py-2.5 text-sm font-semibold text-hijau-800 transition-all hover:bg-hijau-800 hover:text-krem-50 active:scale-[0.97]"
              >
                Semua Berita
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* UMKM */}
      {umkm.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <SectionHeading
            label="UMKM"
            title="Produk Unggulan Warga"
            description="Produk UMKM andalan dari olahan tangan warga Jambon."
          />
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
          <div className="mt-8 text-center">
            <Link
              href="/umkm"
              className="inline-flex items-center gap-2 rounded-full border-2 border-hijau-800 px-6 py-2.5 text-sm font-semibold text-hijau-800 transition-all hover:bg-hijau-800 hover:text-krem-50 active:scale-[0.97]"
            >
              Jelajahi UMKM
            </Link>
          </div>
        </section>
      )}

      {/* GALERI */}
      {albums.length > 0 && (
        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4">
            <SectionHeading
              label="Galeri"
              title="Dokumentasi Kegiatan"
            />
            <div className="grid gap-6 sm:grid-cols-2">
              {albums.map((a, i) => (
                <Reveal key={a.id} delay={i * 120}>
                  <AlbumCard
                    judul={a.judul}
                    slug={a.slug}
                    deskripsi={a.deskripsi}
                    tanggal={a.tanggal}
                    jumlahFoto={a._count?.photos ?? 0}
                    sampul={a.photos[0]?.path ?? null}
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA KONTAK */}
      <section className="bg-hijau-900 py-16 text-center text-krem-50">
        <Reveal className="mx-auto max-w-2xl px-4">
          <h2 className="font-serif text-2xl font-bold sm:text-3xl">
            Butuh Informasi atau Bantuan Layanan?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-krem-100/80 sm:text-base">
            {site?.jamLayanan ?? "Hubungi kami"} — sampaikan kebutuhanmu dan
            kami siap membantu warga Jambon.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {site?.noWhatsApp && (
              <a
                href={linkWhatsApp(site.noWhatsApp, "Halo, saya ingin bertanya tentang layanan desa.")}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-emas-500 px-6 py-3 text-sm font-semibold text-hijau-950 transition-all hover:bg-emas-400 active:scale-[0.97] active:brightness-90"
              >
                Chat WhatsApp
              </a>
            )}
            <Link
              href="/kontak"
              className="rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-krem-50 ring-1 ring-white/40 transition-all hover:bg-white/20 active:scale-[0.97] active:bg-white/30"
            >
              Halaman Kontak
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
