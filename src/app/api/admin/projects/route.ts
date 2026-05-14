/**
 * Project API routes
 */

import { NextRequest, NextResponse } from "next/server"
import { getAdminFromCookies } from "@/lib/auth"
import { getProjects, createProject, updateProject, deleteProject } from "@/lib/github/project-operations"
import { ProjectFormSchema } from "@/lib/validations/project"
import { RealEstateProject } from "@/types"

// Middleware to check authentication
async function checkAuth() {
  const admin = await getAdminFromCookies()
  if (!admin) {
    return null
  }
  return admin
}

/**
 * GET /api/admin/projects
 * Get all projects
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

    const projects = await getProjects()
    return NextResponse.json(
      { success: true, data: projects },
      { status: 200 }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch projects"
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/projects
 * Create new project
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
    const validation = ProjectFormSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: validation.error.errors },
        { status: 400 }
      )
    }

    // Generate ID and slug from name
    const id = body.name.en
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .substring(0, 50)

    const newProject: RealEstateProject = {
      ...validation.data,
      id,
      slug: id,
    }

    const result = await createProject(newProject)

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create project"
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/projects/[id]
 * Update project
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
 * DELETE /api/admin/projects/[id]
 * Delete project
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
