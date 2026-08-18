import Link from "next/link";
import { KbForm } from "@/components/admin/KbForm";
import { buatKb } from "@/lib/actions-admin";

export default function AdminKbBaruPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/admin/kb" className="text-sm font-semibold text-hijau-700 hover:text-hijau-900">
          ← Daftar pengetahuan
        </Link>
        <h1 className="font-serif text-2xl font-bold text-hijau-950">
          Tambah pengetahuan chatbot
        </h1>
      </div>
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
        <KbForm action={buatKb} />
      </div>
    </div>
  );
}
