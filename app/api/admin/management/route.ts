import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getManagementTeam, createManagementMember } from "@/src/lib/github/management-operations"
import type { ManagementMember } from "@/src/lib/github/management-operations"

async function isAuthenticated() {
  const cookieStore = await cookies()
  return cookieStore.get("admin-session")?.value === "authenticated"
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  const data = await getManagementTeam()
  return NextResponse.json({ success: true, data })
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  const body = (await request.json()) as ManagementMember
  const result = await createManagementMember(body)
  return NextResponse.json(result, { status: result.success ? 201 : 400 })
}
