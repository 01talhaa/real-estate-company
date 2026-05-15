import { NextResponse } from "next/server"
import { getManagementTeamCached } from "@/lib/management"

export async function GET() {
  const members = await getManagementTeamCached()
  const response = NextResponse.json({ success: true, data: members })
  response.headers.set("Cache-Control", "s-maxage=60, stale-while-revalidate=300")
  return response
}
