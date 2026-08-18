import Link from "next/link";
import { AlbumForm } from "@/components/admin/AlbumForm";
import { buatAlbum } from "@/lib/actions-admin";

export default function AdminGaleriBaruPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/admin/galeri" className="text-sm font-semibold text-hijau-700 hover:text-hijau-900">
          ← Daftar album
        </Link>
        <h1 className="font-serif text-2xl font-bold text-hijau-950">Buat album baru</h1>
      </div>
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
        <AlbumForm action={buatAlbum} />
      </div>
    </div>
  );
}
