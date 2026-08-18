import "server-only";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export const SUPABASE_BUCKET = "uploads";

export const supabaseAdmin =
  url && serviceKey
    ? createClient(url, serviceKey, { auth: { persistSession: false } })
    : null;

export function supabaseStorageUrl(path?: string | null) {
  if (!path || !url) return null;
  return `${url}/storage/v1/object/public/${SUPABASE_BUCKET}/${path}`;
}

export async function simpanFileStorage(
  buffer: Buffer,
  path: string,
  contentType: string
) {
  if (!supabaseAdmin) return { error: "Supabase tidak dikonfigurasi" };
  const { error } = await supabaseAdmin.storage
    .from(SUPABASE_BUCKET)
    .upload(path, buffer, { contentType, cacheControl: "3600" });
  if (error) return { error: error.message };
  return { ok: true as const };
}

export async function hapusFileStorage(path: string) {
  if (!supabaseAdmin) return;
  await supabaseAdmin.storage.from(SUPABASE_BUCKET).remove([path]);
}
