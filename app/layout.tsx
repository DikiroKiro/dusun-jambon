import type { Metadata, Viewport } from "next";
import { Lora, Plus_Jakarta_Sans } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";

const fontLora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

const fontPlusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const BASE_URL = "https://desa-jambon.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Padukuhan Jambon · Tentrem, Mulya, Lan Makmur",
    template: "%s · Padukuhan Jambon",
  },
  description:
    "Profil resmi Padukuhan Jambon, Hargomulyo, Gedangsari, Gunungkidul, DI Yogyakarta. Informasi layanan administrasi, berita kegiatan, UMKM, dan galeri desa.",
  keywords: [
    "Padukuhan Jambon",
    "Desa Hargomulyo",
    "Gedangsari",
    "Gunungkidul",
    "profil desa",
    "layanan desa",
  ],
  openGraph: {
    title: "Padukuhan Jambon · Tentrem, Mulya, Lan Makmur",
    description:
      "Profil resmi Padukuhan Jambon, Hargomulyo, Gedangsari, Gunungkidul, DI Yogyakarta.",
    type: "website",
    locale: "id_ID",
    url: BASE_URL,
  },
};

export const viewport: Viewport = {
  themeColor: "#2c3d24",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={cn(fontLora.variable, fontPlusJakarta.variable)}>
      <body className="flex min-h-screen flex-col">{children}</body>
    </html>
  );
}
