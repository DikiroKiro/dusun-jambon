import { NextRequest, NextResponse } from "next/server";
import { signSession, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  const adminEmail = process.env.ADMIN_EMAIL || "";
  const adminPassword = process.env.ADMIN_PASSWORD || "";

  if (!adminEmail || !adminPassword) {
    return Response.json(
      { error: "ADMIN_EMAIL / ADMIN_PASSWORD belum diatur di .env" },
      { status: 500 }
    );
  }

  if (email !== adminEmail || password !== adminPassword) {
    return Response.json({ error: "Email atau password salah" }, { status: 401 });
  }

  const token = await signSession(email);

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
    secure: process.env.NODE_ENV === "production" && process.env.VERCEL === "1",
  });
  return res;
}
