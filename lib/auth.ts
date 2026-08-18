import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "admin_session";

export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 hari

export function getSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET || "dev-only-secret-ganti-di-prod";
  return new TextEncoder().encode(secret);
}

export async function signSession(email: string) {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + SESSION_MAX_AGE)
    .sign(getSecret());
}

export async function verifySession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return typeof payload.email === "string" && payload.email.length > 0;
  } catch {
    return false;
  }
}
