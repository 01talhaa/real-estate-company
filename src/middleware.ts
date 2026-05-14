/**
 * Middleware for protecting admin routes
 * Ensures only authenticated admins can access admin pages
 */

import { NextRequest, NextResponse } from "next/server"
import { getAdminFromCookies } from "@/lib/auth"

export async function middleware(request: NextRequest) {
  // Only protect /admin routes
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next()
  }

  // Allow login page without authentication
  if (request.nextUrl.pathname === "/admin/login") {
    return NextResponse.next()
  }

  // Check for admin token
  const admin = await getAdminFromCookies()

  if (!admin) {
    // Redirect to login if not authenticated
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
