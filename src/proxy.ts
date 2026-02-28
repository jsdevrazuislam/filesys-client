import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Define route categories
const AUTH_ROUTES = ["/", "/register", "/forgot-password", "/reset-password"];
const PROTECTED_ROUTES = ["/admin", "/user"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Normalize pathname (remove trailing slash except for root)
  const normalizedPath =
    pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;

  // 1. Get session hint and role hint from cookies
  const hasSession = request.cookies.get("has_session")?.value === "true";
  const userRole = request.cookies.get("user_role")?.value;

  // 2. Handle Public/Auth Routes (Login/Register/Root)
  const isAuthRoute = AUTH_ROUTES.includes(normalizedPath);
  if (isAuthRoute) {
    if (hasSession) {
      const redirectUrl = userRole === "ADMIN" ? "/admin" : "/user";
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
    return NextResponse.next();
  }

  // 3. Handle Protected Routes
  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => normalizedPath === route || normalizedPath.startsWith(`${route}/`)
  );

  if (isProtectedRoute) {
    // if (!hasSession) {
    //   const loginUrl = new URL("/", request.url);
    //   loginUrl.searchParams.set("callbackUrl", pathname);
    //   return NextResponse.redirect(loginUrl);
    // }

    // Role-based protection for /admin
    if (normalizedPath.startsWith("/admin") && userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/user", request.url));
    }

    // Role-based protection for /user
    if (normalizedPath.startsWith("/user") && userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
