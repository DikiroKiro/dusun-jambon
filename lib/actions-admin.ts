"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { verifySession, SESSION_COOKIE } from "@/lib/auth";
import { hapusFileStorage } from "@/lib/supabase";
import {
  beritaSchema,
  albumSchema,
  fotoSchema,
  kbSchema,
} from "@/lib/validators";

type State = { error?: string };

async function wajibLogin() {
  if (!(await verifySession())) redirect("/admin/login");
}

async function hapusFileTersimpan(relPath?: string | null) {
  if (!relPath || relPath.startsWith("http")) return;
  try {
    await hapusFileStorage(relPath);
  } catch {
    // file sudah tidak ada
  }
}

function revalidasiPublik() {
  revalidatePath("/");
  revalidatePath("/berita");
  revalidatePath("/galeri");
  revalidatePath("/umkm");
  revalidatePath("/kontak");
  revalidatePath("/profil");
}

async function slugUnik(
  judul: string,
  cek: (slug: string) => Promise<boolean>
) {
  const base = slugify(judul);
  let slug = base;
  let n = 2;
  while (await cek(slug)) {
    slug = `${base}-${n++}`;
  }
  return slug;
}

function teks(formData: FormData, nama: string) {
  const v = formData.get(nama);
  return typeof v === "string" ? v : "";
}

// ---------- Sesi ----------

export async function logoutAdmin() {
  await wajibLogin();
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/admin/login");
}

// ---------- Berita ----------

export async function buatBerita(
  _prev: State,
  formData: FormData
): Promise<State> {
  await wajibLogin();

  const hasil = beritaSchema.safeParse({
    judul: teks(formData, "judul"),
    ringkasan: teks(formData, "ringkasan"),
    konten: teks(formData, "konten"),
    coverFoto: teks(formData, "coverFoto"),
    penulis: teks(formData, "penulis"),
    status: teks(formData, "status") || "DRAFT",
    publishedAt: teks(formData, "publishedAt"),
  });

  if (!hasil.success) {
    return { error: hasil.error.issues[0]?.message ?? "Data tidak valid" };
  }
  const d = hasil.data;
  let publishedAt: Date | null = null;
  if (d.publishedAt) {
    const t = new Date(d.publishedAt);
    if (!Number.isNaN(t.getTime())) publishedAt = t;
  }
  if (d.status === "PUBLISHED" && !publishedAt) publishedAt = new Date();

  const slug = await slugUnik(d.judul, (s) =>
    prisma.berita
      .findUnique({ where: { slug: s } })
      .then((b) => Boolean(b))
  );

  await prisma.berita.create({
    data: {
      judul: d.judul,
      slug,
      ringkasan: d.ringkasan || null,
      konten: d.konten,
      coverFoto: d.coverFoto || null,
      penulis: d.penulis || null,
      status: d.status,
      publishedAt,
    },
  });

  revalidasiPublik();
  revalidatePath("/admin/berita");
  redirect("/admin/berita");
}

export async function ubahBerita(
  id: string,
  _prev: State,
  formData: FormData
): Promise<State> {
  await wajibLogin();

  const lama = await prisma.berita.findUnique({ where: { id } });
  if (!lama) return { error: "Berita tidak ditemukan" };

  const hasil = beritaSchema.safeParse({
    judul: teks(formData, "judul"),
    ringkasan: teks(formData, "ringkasan"),
    konten: teks(formData, "konten"),
    coverFoto: teks(formData, "coverFoto"),
    penulis: teks(formData, "penulis"),
    status: teks(formData, "status") || "DRAFT",
    publishedAt: teks(formData, "publishedAt"),
  });

  if (!hasil.success) {
    return { error: hasil.error.issues[0]?.message ?? "Data tidak valid" };
  }
  const d = hasil.data;
  let publishedAt: Date | null = lama.publishedAt;
  if (d.publishedAt) {
    const t = new Date(d.publishedAt);
    if (!Number.isNaN(t.getTime())) publishedAt = t;
  }
  if (d.status === "PUBLISHED" && !publishedAt) publishedAt = new Date();

  let slug = lama.slug;
  const judulBerubah = d.judul.trim() !== lama.judul.trim();
  if (judulBerubah || slug === "untitled") {
    slug = await slugUnik(d.judul, (s) =>
      prisma.berita
        .findUnique({ where: { slug: s } })
        .then((b) => Boolean(b && b.id !== id))
    );
  }

  await prisma.berita.update({
    where: { id },
    data: {
      judul: d.judul,
      slug,
      ringkasan: d.ringkasan || null,
      konten: d.konten,
      coverFoto: d.coverFoto || null,
      penulis: d.penulis || null,
      status: d.status,
      publishedAt,
    },
  });

  if (lama.coverFoto && lama.coverFoto !== d.coverFoto) {
    await hapusFileTersimpan(lama.coverFoto);
  }

  revalidasiPublik();
  revalidatePath("/admin/berita");
  redirect("/admin/berita");
}

export async function hapusBerita(id: string) {
  await wajibLogin();
  const lama = await prisma.berita.findUnique({ where: { id } });
  if (!lama) return;
  await prisma.berita.delete({ where: { id } });
  await hapusFileTersimpan(lama.coverFoto);
  revalidasiPublik();
  revalidatePath("/admin/berita");
}

// ---------- Galeri ----------

export async function buatAlbum(
  _prev: State,
  formData: FormData
): Promise<State> {
  await wajibLogin();

  const hasil = albumSchema.safeParse({
    judul: teks(formData, "judul"),
    deskripsi: teks(formData, "deskripsi"),
    tanggal: teks(formData, "tanggal"),
  });
  if (!hasil.success) {
    return { error: hasil.error.issues[0]?.message ?? "Data tidak valid" };
  }
  const d = hasil.data;

  const jalurFoto = formData
    .getAll("fotos[]")
    .filter((v): v is string => typeof v === "string" && v.trim().length > 0);
  const keteranganFoto = formData
    .getAll("captions[]")
    .filter((v): v is string => typeof v === "string");
  if (jalurFoto.length === 0) return { error: "Minimal satu foto diunggah" };

  const validFoto = jalurFoto.map((p, i) =>
    fotoSchema.parse({ path: p, caption: keteranganFoto[i] || "" })
  );

  const slug = await slugUnik(d.judul, (s) =>
    prisma.album
      .findUnique({ where: { slug: s } })
      .then((a) => Boolean(a))
  );

  const tanggal = d.tanggal ? new Date(d.tanggal) : null;

  await prisma.album.create({
    data: {
      judul: d.judul,
      slug,
      deskripsi: d.deskripsi || null,
      tanggal,
      photos: {
        create: validFoto.map((f, i) => ({
          path: f.path,
          caption: f.caption || null,
          urutan: i + 1,
        })),
      },
    },
  });

  revalidasiPublik();
  revalidatePath("/admin/galeri");
  redirect("/admin/galeri");
}

export async function ubahAlbum(
  id: string,
  _prev: State,
  formData: FormData
): Promise<State> {
  await wajibLogin();

  const lama = await prisma.album.findUnique({ where: { id } });
  if (!lama) return { error: "Album tidak ditemukan" };

  const hasil = albumSchema.safeParse({
    judul: teks(formData, "judul"),
    deskripsi: teks(formData, "deskripsi"),
    tanggal: teks(formData, "tanggal"),
  });
  if (!hasil.success) {
    return { error: hasil.error.issues[0]?.message ?? "Data tidak valid" };
  }
  const d = hasil.data;

  let slug = lama.slug;
  if (d.judul.trim() !== lama.judul.trim()) {
    slug = await slugUnik(d.judul, (s) =>
      prisma.album
        .findUnique({ where: { slug: s } })
        .then((a) => Boolean(a && a.id !== id))
    );
  }

  const jalurFoto = formData
    .getAll("fotos[]")
    .filter((v): v is string => typeof v === "string" && v.trim().length > 0);
  const keteranganFoto = formData
    .getAll("captions[]")
    .filter((v): v is string => typeof v === "string");
  const validFoto = jalurFoto.map((p, i) =>
    fotoSchema.parse({ path: p, caption: keteranganFoto[i] || "" })
  );

  const tanggal = d.tanggal ? new Date(d.tanggal) : null;

  const terakhir = await prisma.photo.aggregate({
    where: { albumId: id },
    _max: { urutan: true },
  });

  await prisma.album.update({
    where: { id },
    data: {
      judul: d.judul,
      slug,
      deskripsi: d.deskripsi || null,
      tanggal,
      photos: {
        create: validFoto.map((f, i) => ({
          path: f.path,
          caption: f.caption || null,
          urutan: (terakhir._max.urutan ?? 0) + i + 1,
        })),
      },
    },
  });

  revalidasiPublik();
  revalidatePath("/admin/galeri");
  revalidatePath(`/admin/galeri/${id}`);
  redirect("/admin/galeri");
}

export async function hapusAlbum(id: string) {
  await wajibLogin();
  const lama = await prisma.album.findUnique({
    where: { id },
    include: { photos: true },
  });
  if (!lama) return;
  await prisma.album.delete({ where: { id } });
  for (const f of lama.photos) await hapusFileTersimpan(f.path);
  revalidasiPublik();
  revalidatePath("/admin/galeri");
}

export async function hapusFoto(id: string) {
  await wajibLogin();
  const foto = await prisma.photo.findUnique({ where: { id } });
  if (!foto) return;
  await prisma.photo.delete({ where: { id } });
  await hapusFileTersimpan(foto.path);
  revalidasiPublik();
  revalidatePath(`/admin/galeri/${foto.albumId}`);
}

// ---------- KB Chatbot ----------

export async function buatKb(
  _prev: State,
  formData: FormData
): Promise<State> {
  await wajibLogin();

  const hasil = kbSchema.safeParse({
    kategori: teks(formData, "kategori"),
    judul: teks(formData, "judul"),
    isi: teks(formData, "isi"),
    aktif: formData.get("aktif") === "on",
  });
  if (!hasil.success) {
    return { error: hasil.error.issues[0]?.message ?? "Data tidak valid" };
  }

  await prisma.kbEntry.create({
    data: {
      kategori: hasil.data.kategori,
      judul: hasil.data.judul,
      isi: hasil.data.isi,
      aktif: hasil.data.aktif,
    },
  });

  revalidatePath("/admin/kb");
  redirect("/admin/kb");
}

export async function ubahKb(
  id: string,
  _prev: State,
  formData: FormData
): Promise<State> {
  await wajibLogin();

  const lama = await prisma.kbEntry.findUnique({ where: { id } });
  if (!lama) return { error: "Data tidak ditemukan" };

  const hasil = kbSchema.safeParse({
    kategori: teks(formData, "kategori"),
    judul: teks(formData, "judul"),
    isi: teks(formData, "isi"),
    aktif: formData.get("aktif") === "on",
  });
  if (!hasil.success) {
    return { error: hasil.error.issues[0]?.message ?? "Data tidak valid" };
  }

  await prisma.kbEntry.update({
    where: { id },
    data: {
      kategori: hasil.data.kategori,
      judul: hasil.data.judul,
      isi: hasil.data.isi,
      aktif: hasil.data.aktif,
    },
  });

  revalidatePath("/admin/kb");
  redirect("/admin/kb");
}

export async function hapusKb(id: string) {
  await wajibLogin();
  await prisma.kbEntry.delete({ where: { id } }).catch(() => undefined);
  revalidatePath("/admin/kb");
}
