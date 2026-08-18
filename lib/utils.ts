export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function uploadUrl(path?: string | null) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (base) return `${base}/storage/v1/object/public/uploads/${path}`;
  return `/uploads/${path}`;
}

export function formatTanggal(date: Date | string | null | undefined) {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatTanggalSingkat(date: Date | string | null | undefined) {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function linkWhatsApp(noWhatsApp?: string | null, teks?: string) {
  const nomor = (noWhatsApp || "").replace(/[^\d]/g, "");
  if (!nomor) return "#";
  const pesan = teks ? `?text=${encodeURIComponent(teks)}` : "";
  return `https://wa.me/${nomor}${pesan}`;
}

export function inisial(nama: string) {
  return nama
    .split(/\s+/)
    .slice(0, 2)
    .map((kata) => kata[0])
    .join("")
    .toUpperCase();
}

export function excerpt(teks: string, panjang = 160) {
  const bersih = teks.replace(/\s+/g, " ").trim();
  if (bersih.length <= panjang) return bersih;
  return bersih.slice(0, panjang).trimEnd() + "…";
}

export function ringkasMisi(misi: string) {
  return misi
    .split("\n")
    .map((m) => m.trim())
    .filter(Boolean);
}

export function slugify(teks: string) {
  const bersih = teks
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return bersih || "untitled";
}
