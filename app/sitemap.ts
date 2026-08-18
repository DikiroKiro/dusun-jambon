import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE_URL = "https://desa-jambon.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/profil",
    "/berita",
    "/umkm",
    "/galeri",
    "/layanan",
    "/kontak",
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  const albums = await prisma.album.findMany({
    select: { slug: true, createdAt: true },
  });
  const albumRoutes: MetadataRoute.Sitemap = albums.map((a) => ({
    url: `${BASE_URL}/galeri/${a.slug}`,
    lastModified: a.createdAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const berita = await prisma.berita.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
  });
  const beritaRoutes: MetadataRoute.Sitemap = berita.map((b) => ({
    url: `${BASE_URL}/berita/${b.slug}`,
    lastModified: b.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...albumRoutes, ...beritaRoutes];
}
