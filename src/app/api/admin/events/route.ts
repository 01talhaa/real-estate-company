/**
 * Event API routes
 */

import { NextRequest, NextResponse } from "next/server"
import { getAdminFromCookies } from "@/lib/auth"
import { getEvents, createEvent, updateEvent, deleteEvent } from "@/lib/github/event-operations"
import { EventFormSchema } from "@/lib/validations/event"
import { SabitEvent } from "@/types"

// Middleware to check authentication
async function checkAuth() {
  const admin = await getAdminFromCookies()
  if (!admin) {
    return null
  }
  return admin
}

/**
 * GET /api/admin/events
 * Get all events
 */
export async function GET() {
  try {
    const admin = await checkAuth()
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const events = await getEvents()
    return NextResponse.json(
      { success: true, data: events },
      { status: 200 }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch events"
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/events
 * Create new event
 */
export async function POST(request: NextRequest) {
  try {
    const admin = await checkAuth()
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validate input
    const validation = EventFormSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: validation.error.errors },
        { status: 400 }
      )
    }

    // Generate ID from title
    const id = body.title.en
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .substring(0, 50)

    const newEvent: SabitEvent = {
      ...validation.data,
      id,
    }

    const result = await createEvent(newEvent)

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create event"
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'

/**
 * PUT /api/admin/events/[id]
 * Update event
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
 * DELETE /api/admin/events/[id]
 * Delete event
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
