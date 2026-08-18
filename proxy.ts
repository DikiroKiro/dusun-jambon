import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "admin_session";

function getSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET || "dev-only-secret-ganti-di-prod";
  return new TextEncoder().encode(secret);
}

export async function proxy(req: NextRequest) {
  // Login page & assets admin tidak perlu sesi
  if (req.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = req.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  try {
    await jwtVerify(token, getSecret());
    return NextResponse.next();
  } catch {
    const res = NextResponse.redirect(new URL("/admin/login", req.url));
    res.cookies.delete(COOKIE_NAME);
    return res;
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
