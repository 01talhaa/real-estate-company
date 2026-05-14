import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { deleteManagementMember, getManagementMemberById, updateManagementMember } from "@/src/lib/github/management-operations"
import type { ManagementMember } from "@/src/lib/github/management-operations"

async function isAuthenticated() {
  const cookieStore = await cookies()
  return cookieStore.get("admin-session")?.value === "authenticated"
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const member = await getManagementMemberById(id)

  if (!member) {
    return NextResponse.json({ success: false, error: "Management member not found" }, { status: 404 })
  }

  return NextResponse.json({ success: true, data: member })
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const body = (await request.json()) as Partial<ManagementMember>
  const result = await updateManagementMember(id, body)
  return NextResponse.json(result, { status: result.success ? 200 : 400 })
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const result = await deleteManagementMember(id)
  return NextResponse.json(result, { status: result.success ? 200 : 400 })
}
