import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

export const beritaSchema = z.object({
  judul: z.string().trim().min(3, "Judul minimal 3 karakter"),
  ringkasan: z.string().trim().max(300, "Ringkasan maksimal 300 karakter").optional(),
  konten: z.string().trim().min(10, "Isi berita minimal 10 karakter"),
  coverFoto: z.string().trim().optional(),
  penulis: z.string().trim().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  publishedAt: z.string().optional(),
});

export const albumSchema = z.object({
  judul: z.string().trim().min(3, "Judul album minimal 3 karakter"),
  deskripsi: z.string().trim().optional(),
  tanggal: z.string().optional(),
});

export const fotoSchema = z.object({
  path: z.string().trim().min(1, "File foto wajib diunggah"),
  caption: z.string().trim().optional(),
});

export const kbSchema = z.object({
  kategori: z.string().trim().min(1, "Kategori wajib dipilih"),
  judul: z.string().trim().min(3, "Judul minimal 3 karakter"),
  isi: z.string().trim().min(10, "Isi minimal 10 karakter"),
  aktif: z.boolean().default(true),
});
