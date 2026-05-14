import { NextResponse } from "next/server"
import { getManagementMemberById } from "@/src/lib/github/management-operations"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const member = await getManagementMemberById(id)

  if (!member) {
    return NextResponse.json({ success: false, error: "Management member not found" }, { status: 404 })
  }

  return NextResponse.json({ success: true, data: member })
}
