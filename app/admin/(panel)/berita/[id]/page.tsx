import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BeritaForm } from "@/components/admin/BeritaForm";
import { ubahBerita } from "@/lib/actions-admin";

export default async function AdminBeritaEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const berita = await prisma.berita.findUnique({ where: { id } });
  if (!berita) notFound();

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/admin/berita" className="text-sm font-semibold text-hijau-700 hover:text-hijau-900">
          ← Daftar berita
        </Link>
        <h1 className="font-serif text-2xl font-bold text-hijau-950">Edit berita</h1>
      </div>
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
        <BeritaForm action={ubahBerita.bind(null, berita.id)} awal={berita} />
      </div>
    </div>
  );
}
