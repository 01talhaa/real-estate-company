/**
 * GET /api/admin/auth/me
 * Get current logged-in admin
 */

import { getAdminFromCookies } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const admin = await getAdminFromCookies()

    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Get admin error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
