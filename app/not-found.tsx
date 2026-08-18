import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center">
      <p className="font-serif text-7xl font-bold text-hijau-300">404</p>
      <h1 className="mt-4 font-serif text-2xl font-bold text-hijau-950">
        Halaman tidak ditemukan
      </h1>
      <p className="mt-2 text-sm text-stone-600">
        Halaman yang kamu cari mungkin sudah dipindah atau tidak tersedia.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-hijau-800 px-6 py-3 text-sm font-semibold text-krem-50 transition-colors hover:bg-hijau-900"
      >
        Kembali ke Beranda
      </Link>
    </section>
  );
}
