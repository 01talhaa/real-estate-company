import { NextRequest, NextResponse } from "next/server"
import { deleteProject, getProjectByIdCached, updateProject } from "@/lib/projects"
import type { Project } from "@/types/project"

// GET /api/projects/[id] - Get a single project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const project = await getProjectByIdCached(id)

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    const response = NextResponse.json({ success: true, data: project })
    response.headers.set("Cache-Control", "s-maxage=60, stale-while-revalidate=300")
    return response
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}

// PUT /api/projects/[id] - Update a project
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const updated = await updateProject({ ...(body as Project), id } as Project)
    const response = NextResponse.json({ success: true, data: updated }, { status: 200 })
    response.headers.set("Cache-Control", "no-store")
    return response
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update project' },
      { status: 500 }
    )
  }
}

// DELETE /api/projects/[id] - Delete a project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const result = await deleteProject(id)
    const response = NextResponse.json(result, { status: 200 })
    response.headers.set("Cache-Control", "no-store")
    return response
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'
