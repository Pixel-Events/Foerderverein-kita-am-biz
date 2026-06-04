import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const adminAuth = request.cookies.get("admin_auth");

  if (
    request.nextUrl.pathname.startsWith("/verwaltung") &&
    !adminAuth
  ) {
    return NextResponse.redirect(
      new URL("/admin/login", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/verwaltung/:path*"],
};