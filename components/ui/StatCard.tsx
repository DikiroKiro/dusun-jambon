type Props = {
  label: string;
  nilai: string;
  tahun?: string | null;
};

export function StatCard({ label, nilai, tahun }: Props) {
  return (
    <div className="rounded-2xl bg-white/95 px-4 py-5 text-center shadow-sm ring-1 ring-hijau-100">
      <p className="font-serif text-3xl font-bold text-hijau-800">{nilai}</p>
      <p className="mt-1 text-sm font-medium text-stone-700">{label}</p>
      {tahun && <p className="mt-0.5 text-xs text-stone-400">{tahun}</p>}
    </div>
  );
}
