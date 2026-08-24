import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatTanggal, uploadUrl } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const berita = await prisma.berita.findUnique({
    where: { slug },
    select: { judul: true, ringkasan: true },
  });
  if (!berita) return { title: "Berita tidak ditemukan" };
  return {
    title: berita.judul,
    description: berita.ringkasan ?? undefined,
  };
}

export async function generateStaticParams() {
  const berita = await prisma.berita.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true },
  });
  return berita.map((b) => ({ slug: b.slug }));
}

export default async function BeritaDetailPage({ params }: Props) {
  const { slug } = await params;
  const berita = await prisma.berita.findUnique({
    where: { slug },
  });

  if (!berita || berita.status !== "PUBLISHED") notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:py-18">
      <nav className="mb-6 text-sm text-stone-500">
        <Link href="/berita" className="hover:text-hijau-700">
          Berita
        </Link>
        <span className="mx-2">/</span>
        <span className="font-medium text-hijau-900">{berita.judul}</span>
      </nav>

      <Reveal>
        <div className="mb-6 flex items-center gap-2 text-xs text-stone-500">
          <Badge tone="hijau">Berita</Badge>
          {berita.publishedAt && (
            <span>{formatTanggal(berita.publishedAt)}</span>
          )}
          {berita.penulis && <span>· {berita.penulis}</span>}
        </div>
        <h1 className="font-serif text-3xl font-bold leading-tight text-hijau-950 sm:text-4xl">
          {berita.judul}
        </h1>
        {berita.ringkasan && (
          <p className="mt-4 text-base leading-relaxed text-stone-600">
            {berita.ringkasan}
          </p>
        )}
      </Reveal>

      {berita.coverFoto && (
        <Reveal delay={100} className="mt-8 overflow-hidden rounded-2xl shadow-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={uploadUrl(berita.coverFoto) ?? ""}
            alt={berita.judul}
            className="aspect-[16/9] w-full object-cover"
          />
        </Reveal>
      )}

      <Reveal delay={150} className="mt-8">
        <div className="whitespace-pre-line text-base leading-relaxed text-stone-700">
          {berita.konten}
        </div>
      </Reveal>

      <div className="mt-10 border-t border-hijau-100 pt-6">
        <Link
          href="/berita"
          className="inline-flex items-center gap-2 text-sm font-semibold text-hijau-700 hover:text-hijau-900"
        >
          ← Kembali ke daftar berita
        </Link>
      </div>
    </article>
  );
}
