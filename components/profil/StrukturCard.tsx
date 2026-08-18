import { inisial, uploadUrl } from "@/lib/utils";

type Props = {
  nama: string;
  jabatan: string;
  foto: string | null;
};

export function StrukturCard({ nama, jabatan, foto }: Props) {
  return (
    <div className="flex flex-col items-center rounded-2xl bg-white p-5 text-center shadow-sm ring-1 ring-hijau-100">
      <div className="mb-3 h-20 w-20 overflow-hidden rounded-full bg-hijau-100 ring-2 ring-emas-300">
        {foto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={uploadUrl(foto) ?? ""}
            alt={nama}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-serif text-xl font-semibold text-hijau-700">
            {inisial(nama)}
          </div>
        )}
      </div>
      <h3 className="font-serif text-base font-semibold text-hijau-950">{nama}</h3>
      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-emas-700">
        {jabatan}
      </p>
    </div>
  );
}
