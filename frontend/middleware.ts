import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const config = {
  matcher: ["/admin/:path*"],
};

export async function middleware(request: NextRequest) {
  try {
    const url = request.nextUrl.clone();
    // Allow API routes under /admin/api if any (server-side will enforce more granular rules)
    // Read token cookie (HttpOnly) from the request
    const token = request.cookies.get("token")?.value;

    if (!token) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    // Verify token with backend /auth/me endpoint
    const meRes = await fetch(`${BACKEND_URL.replace(/\/+$/,"")}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "GET",
    });

    if (!meRes.ok) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    const meJson = await meRes.json();
    const isAdmin = !!(meJson?.user?.isAdmin);
    if (!isAdmin) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    // Authorized
    return NextResponse.next();
  } catch (err) {
    console.error("Middleware auth check failed:", err);
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    return NextResponse.redirect(redirectUrl);
  }
}
