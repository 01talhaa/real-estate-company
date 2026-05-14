import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getEvents, createEvent } from "@/src/lib/github/event-operations"
import type { SabitEvent } from "@/types"

async function isAuthenticated() {
  const cookieStore = await cookies()
  return cookieStore.get("admin-session")?.value === "authenticated"
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  const data = await getEvents()
  return NextResponse.json({ success: true, data })
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  const body = (await request.json()) as SabitEvent
  const result = await createEvent(body)
  return NextResponse.json(result, { status: result.success ? 201 : 400 })
}
