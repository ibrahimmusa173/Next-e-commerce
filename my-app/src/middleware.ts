import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth as nextAuthHandler } from "@/auth";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-123";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let resolvedRole: string | null = null;
  let isAuthenticated = false;

  // --- STRATEGY A: Check for Credentials Custom JWT Cookie ---
  const customAuthCookie = request.cookies.get("auth_token")?.value;

  if (customAuthCookie) {
    try {
      // Decode statelessly using the edge-compatible 'jose' module
      const secretKey = new TextEncoder().encode(JWT_SECRET);
      const { payload } = await jwtVerify(customAuthCookie, secretKey);
      
      if (payload && payload.role) {
        resolvedRole = payload.role as string;
        isAuthenticated = true;
      }
    } catch (error) {
      console.error("Credentials JWT verification failed or expired in middleware:", error);
    }
  }

  // --- STRATEGY B: Check for Google NextAuth Session (If Credentials Not Found) ---
  if (!isAuthenticated) {
    const nextAuthSession = await nextAuthHandler();
    if (nextAuthSession?.user) {
      resolvedRole = nextAuthSession.user.role || "client";
      isAuthenticated = true;
    }
  }

  // --- SECURITY ENFORCEMENT RULES ---

  // 1. UNUATHENTICATED BLOCK: Redirect away if both checks fail
  if (!isAuthenticated || !resolvedRole) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("error", "Please sign in to view this dashboard.");
    return NextResponse.redirect(loginUrl);
  }

  // 2. ADMIN PROTECTION
  if (pathname.startsWith("/admin-dashboard")) {
    if (resolvedRole !== "admin") {
      return NextResponse.redirect(new URL("/client-dashboard", request.url));
    }
  }

  // 3. CLIENT PROTECTION
  if (pathname.startsWith("/client-dashboard")) {
    if (resolvedRole !== "client") {
      return NextResponse.redirect(new URL("/admin-dashboard", request.url));
    }
  }

  return NextResponse.next();
}

// Ensure this middleware intercepts only your target routes
export const config = {
  matcher: [
    "/admin-dashboard/:path*",
    "/client-dashboard/:path*",
  ],
};
