/**
 * PUT /api/admin/projects/[id]
 * UPDATE /api/admin/projects/[id]
 * DELETE /api/admin/projects/[id]
 */

import { NextRequest, NextResponse } from "next/server"
import { getAdminFromCookies } from "@/lib/auth"
import { updateProject, deleteProject } from "@/lib/github/project-operations"
import { ProjectFormSchema } from "@/lib/validations/project"

// Middleware to check authentication
async function checkAuth() {
  const admin = await getAdminFromCookies()
  if (!admin) {
    return null
  }
  return admin
}

/**
 * PUT - Update project
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
    const validation = ProjectFormSchema.partial().safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: validation.error.errors },
        { status: 400 }
      )
    }

    const result = await updateProject(id, validation.data)

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update project"
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}

/**
 * DELETE - Delete project
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
    const result = await deleteProject(id)

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete project"
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'
