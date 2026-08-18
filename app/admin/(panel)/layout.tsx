import { redirect } from "next/navigation";
import Link from "next/link";
import { verifySession } from "@/lib/auth";
import { logoutAdmin } from "@/lib/actions-admin";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await verifySession())) redirect("/admin/login");

  return (
    <div className="flex min-h-screen flex-col bg-stone-100">
      <header className="sticky top-0 z-20 bg-hijau-900 text-krem-50 shadow">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/admin" className="font-serif text-lg font-bold">
            Panel Admin Jambon
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="rounded-lg bg-white/10 px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-white/20"
            >
              Lihat Situs ↗
            </Link>
            <form action={logoutAdmin}>
              <button
                type="submit"
                className="rounded-lg bg-emas-500 px-3 py-1.5 text-sm font-semibold text-hijau-950 transition-colors hover:bg-emas-400"
              >
                Keluar
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 lg:flex-row">
        <aside className="lg:w-52 lg:shrink-0">
          <AdminNav />
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
