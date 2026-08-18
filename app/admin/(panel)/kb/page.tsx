import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { excerpt } from "@/lib/utils";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { hapusKb } from "@/lib/actions-admin";
import { cn } from "@/lib/utils";

export default async function AdminKbPage() {
  const daftar = await prisma.kbEntry.findMany({
    orderBy: [{ kategori: "asc" }, { judul: "asc" }],
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-bold text-hijau-950">
            Pengetahuan Chatbot
          </h1>
          <p className="text-sm text-stone-500">
            Basis pengetahuan yang dipakai Asisten Jambon untuk menjawab
            pertanyaan warga. Gemini dipakai sebagai cadangan bila tidak cocok.
          </p>
        </div>
        <Link
          href="/admin/kb/baru"
          className="rounded-lg bg-hijau-800 px-4 py-2.5 text-sm font-semibold text-krem-50 transition-colors hover:bg-hijau-900"
        >
          + Tambah pengetahuan
        </Link>
      </div>

      {daftar.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-stone-200">
          <p className="text-sm text-stone-500">
            Belum ada data pengetahuan.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200">
          <ul className="divide-y divide-stone-100">
            {daftar.map((k) => (
              <li key={k.id} className="flex items-center gap-4 px-4 py-3">
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                    k.kategori === "SURAT"
                      ? "bg-blue-100 text-blue-700"
                      : k.kategori === "PROGRAM"
                        ? "bg-purple-100 text-purple-700"
                        : k.kategori === "POSYANDU"
                          ? "bg-pink-100 text-pink-700"
                          : k.kategori === "KONTAK"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-stone-100 text-stone-600"
                  )}
                >
                  {k.kategori}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 truncate text-sm font-semibold text-stone-800">
                    {k.judul}
                    {!k.aktif && (
                      <span className="rounded-full bg-stone-200 px-2 py-0.5 text-[10px] font-bold text-stone-500">
                        NONAKTIF
                      </span>
                    )}
                  </p>
                  <p className="truncate text-xs text-stone-400">
                    {excerpt(k.isi, 90)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Link
                    href={`/admin/kb/${k.id}`}
                    className="rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-semibold text-stone-700 transition-colors hover:bg-stone-50"
                  >
                    Edit
                  </Link>
                  <DeleteButton
                    action={hapusKb.bind(null, k.id)}
                    pesan={`Hapus pengetahuan "${k.judul}"?`}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
