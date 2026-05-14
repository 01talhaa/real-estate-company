import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getEventById, updateEvent, deleteEvent } from "@/src/lib/github/event-operations"

async function isAuthenticated() {
  const cookieStore = await cookies()
  return cookieStore.get("admin-session")?.value === "authenticated"
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const event = await getEventById(id)

  if (!event) {
    return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 })
  }

  return NextResponse.json({ success: true, data: event }, { status: 200 })
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()
  const result = await updateEvent(id, body)
  return NextResponse.json(result, { status: result.success ? 200 : 400 })
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const result = await deleteEvent(id)
  return NextResponse.json(result, { status: result.success ? 200 : 400 })
}
