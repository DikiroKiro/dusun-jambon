import { NextRequest } from "next/server";
import sharp from "sharp";
import { jwtVerify } from "jose";
import { getSecret, SESSION_COOKIE } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { simpanFileStorage, hapusFileStorage } from "@/lib/supabase";

export const runtime = "nodejs";

const FOLDER_BOLEH = ["berita", "galeri", "umkm", "hero", "struktur", "lain"];
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
};

async function cekLogin(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  if (!(await cekLogin(req))) {
    return Response.json({ error: "Tidak ada izin" }, { status: 401 });
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  const folder = form?.get("folder");

  if (!(file instanceof File)) {
    return Response.json({ error: "File tidak ditemukan" }, { status: 400 });
  }
  if (typeof folder !== "string" || !FOLDER_BOLEH.includes(folder)) {
    return Response.json({ error: "Folder tidak valid" }, { status: 400 });
  }
  if (!file.type.startsWith("image/") || !EXT[file.type]) {
    return Response.json({ error: "Format gambar tidak didukung" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return Response.json({ error: "Ukuran gambar maksimal 10 MB" }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const hasil = await sharp(buffer)
      .rotate()
      .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
      .toBuffer();

    const nama = `${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, "")) || "gambar"}${EXT[file.type]}`;
    const path = `${folder}/${nama}`;

    const simpan = await simpanFileStorage(hasil, path, file.type);
    if (simpan.error) {
      return Response.json({ error: `Gagal upload ke Supabase: ${simpan.error}` }, { status: 500 });
    }

    return Response.json({ path });
  } catch {
    return Response.json({ error: "Gagal memproses gambar" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await cekLogin(req))) {
    return Response.json({ error: "Tidak ada izin" }, { status: 401 });
  }

  const relPath = req.nextUrl.searchParams.get("path") ?? "";
  if (!relPath || relPath.includes("..") || relPath.startsWith("/")) {
    return Response.json({ error: "Path tidak valid" }, { status: 400 });
  }
  const folder = relPath.split("/")[0];
  if (!FOLDER_BOLEH.includes(folder)) {
    return Response.json({ error: "Path tidak valid" }, { status: 400 });
  }

  try {
    await hapusFileStorage(relPath);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "File tidak ditemukan" }, { status: 404 });
  }
}
