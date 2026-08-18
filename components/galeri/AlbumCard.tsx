import Link from "next/link";
import { formatTanggal, uploadUrl } from "@/lib/utils";

type Props = {
  judul: string;
  slug: string;
  deskripsi: string | null;
  tanggal: Date | null;
  jumlahFoto: number;
  sampul: string | null;
};

export function AlbumCard({ judul, slug, deskripsi, tanggal, jumlahFoto, sampul }: Props) {
  return (
    <Link
      href={`/galeri/${slug}`}
      className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-hijau-100 transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-hijau-100">
        {sampul ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={uploadUrl(sampul) ?? ""}
            alt={judul}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-serif text-5xl text-hijau-300">
            📷
          </div>
        )}
        <span className="absolute bottom-3 right-3 rounded-full bg-hijau-950/80 px-3 py-1 text-xs font-medium text-krem-50">
          {jumlahFoto} foto
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-serif text-lg font-semibold text-hijau-950 group-hover:text-hijau-700">
          {judul}
        </h3>
        <p className="line-clamp-2 mt-1 text-sm text-stone-600">{deskripsi}</p>
        {tanggal && <p className="mt-2 text-xs text-stone-400">{formatTanggal(tanggal)}</p>}
      </div>
    </Link>
  );
}
