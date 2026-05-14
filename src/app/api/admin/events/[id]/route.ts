/**
 * PUT /api/admin/events/[id]
 * UPDATE /api/admin/events/[id]
 * DELETE /api/admin/events/[id]
 */

import { NextRequest, NextResponse } from "next/server"
import { getAdminFromCookies } from "@/lib/auth"
import { updateEvent, deleteEvent } from "@/lib/github/event-operations"
import { EventFormSchema } from "@/lib/validations/event"

// Middleware to check authentication
async function checkAuth() {
  const admin = await getAdminFromCookies()
  if (!admin) {
    return null
  }
  return admin
}

/**
 * PUT - Update event
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await checkAuth()
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()

    // Validate input - partial update allowed
    const validation = EventFormSchema.partial().safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: validation.error.errors },
        { status: 400 }
      )
    }

    const result = await updateEvent(id, validation.data)

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update event"
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}

/**
 * DELETE - Delete event
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await checkAuth()
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params
    const result = await deleteEvent(id)

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete event"
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
