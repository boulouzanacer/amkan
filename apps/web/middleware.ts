import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

function requestOrigin(request: NextRequest) {
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") || "http";
  return host ? `${proto}://${host}` : request.nextUrl.origin;
}

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const path = request.nextUrl.pathname;
  const origin = requestOrigin(request);
  const loginUrl = new URL("/login", origin);
  loginUrl.searchParams.set("callbackUrl", `${request.nextUrl.pathname}${request.nextUrl.search}`);

  if (!token) {
    return NextResponse.redirect(loginUrl);
  }

  if (path.startsWith("/admin") && token.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", origin));
  }

  if (path.startsWith("/host") && token.role !== "HOST" && token.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/host/:path*", "/traveler/:path*", "/favorites/:path*", "/messages/:path*", "/profile", "/security", "/verification", "/notifications"]
};
