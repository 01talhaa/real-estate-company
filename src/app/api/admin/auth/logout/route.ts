/**
 * POST /api/admin/auth/logout
 * Handle admin logout
 */

import { clearAdminCookie } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    await clearAdminCookie()

    return NextResponse.json(
      { success: true, message: "Logout successful" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'
