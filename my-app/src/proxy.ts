import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth as nextAuthHandler } from "@/auth";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-123";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let resolvedRole: string | null = null;
  let isAuthenticated = false;

  // --- STRATEGY A: Check for Credentials Custom JWT Cookie ---
  const customAuthCookie = request.cookies.get("auth_token")?.value;

  if (customAuthCookie) {
    try {
      const secretKey = new TextEncoder().encode(JWT_SECRET);
      const { payload } = await jwtVerify(customAuthCookie, secretKey);
      
      if (payload && payload.role) {
        resolvedRole = payload.role as string;
        isAuthenticated = true;
      }
    } catch (error) {
      console.error("Credentials token decryption skipped or invalid:", error);
    }
  }

  // --- STRATEGY B: Check for Google NextAuth Session ---
  if (!isAuthenticated) {
    try {
      const nextAuthSession = await nextAuthHandler();
      if (nextAuthSession?.user) {
        resolvedRole = nextAuthSession.user.role || "client";
        isAuthenticated = true;
      }
    } catch (error) {
      console.error("NextAuth session check errored at the edge:", error);
    }
  }

  // --- SECURITY ENFORCEMENT RULES ---
  if (!isAuthenticated || !resolvedRole) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("error", "Authentication required.");
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/admin-dashboard") && resolvedRole !== "admin") {
    return NextResponse.redirect(new URL("/client-dashboard", request.url));
  }

  if (pathname.startsWith("/client-dashboard") && resolvedRole !== "client") {
    return NextResponse.redirect(new URL("/admin-dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin-dashboard/:path*",
    "/client-dashboard/:path*",
  ],
};
