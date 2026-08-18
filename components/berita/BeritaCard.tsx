import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { formatTanggalSingkat, uploadUrl } from "@/lib/utils";

type Props = {
  judul: string;
  slug: string;
  ringkasan: string | null;
  coverFoto: string | null;
  publishedAt: Date | null;
};

export function BeritaCard({ judul, slug, ringkasan, coverFoto, publishedAt }: Props) {
  return (
    <Link
      href={`/berita/${slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-hijau-100 transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-hijau-100">
        {coverFoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={uploadUrl(coverFoto) ?? ""}
            alt={judul}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-serif text-4xl text-hijau-300">
            🌾
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <Badge tone="hijau">Berita</Badge>
          {publishedAt && <span>{formatTanggalSingkat(publishedAt)}</span>}
        </div>
        <h3 className="font-serif text-lg font-semibold leading-snug text-hijau-950 group-hover:text-hijau-700">
          {judul}
        </h3>
        <p className="line-clamp-3 text-sm leading-relaxed text-stone-600">
          {ringkasan}
        </p>
      </div>
    </Link>
  );
}
