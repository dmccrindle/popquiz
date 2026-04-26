import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_HOSTS = new Set([
  "admin.popquizparty.com",
  "admin.localhost:3000",
]);

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const url = request.nextUrl.clone();

  if (ADMIN_HOSTS.has(host)) {
    if (url.pathname === "/" || url.pathname === "") {
      url.pathname = "/admin";
      return NextResponse.rewrite(url);
    }
    if (!url.pathname.startsWith("/admin") && !url.pathname.startsWith("/api/")) {
      url.pathname = `/admin${url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$|.*\\.jpg$|.*\\.mp4$).*)"],
};
