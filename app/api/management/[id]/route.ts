import { NextResponse } from "next/server"
import { getManagementMemberByIdCached } from "@/lib/management"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const member = await getManagementMemberByIdCached(id)

  if (!member) {
    return NextResponse.json({ success: false, error: "Management member not found" }, { status: 404 })
  }

  const response = NextResponse.json({ success: true, data: member })
  response.headers.set("Cache-Control", "s-maxage=60, stale-while-revalidate=300")
  return response
}
