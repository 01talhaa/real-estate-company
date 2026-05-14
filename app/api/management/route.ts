import { NextResponse } from "next/server"
import { getManagementTeam } from "@/src/lib/github/management-operations"

export async function GET() {
  const members = await getManagementTeam()
  return NextResponse.json({ success: true, data: members })
}
