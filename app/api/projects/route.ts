import { NextRequest, NextResponse } from "next/server"
import { createProject, getProjectsCached } from "@/lib/projects"
import type { Project } from "@/types/project"

// GET /api/projects - List all projects
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = searchParams.get('limit')
    const page = searchParams.get('page') || '1'
    const projects = await getProjectsCached()
    const filtered = status ? projects.filter((project) => project.status === status) : projects
    const sliced = limit
      ? filtered.slice((parseInt(page) - 1) * parseInt(limit), (parseInt(page) - 1) * parseInt(limit) + parseInt(limit))
      : filtered

    const response = NextResponse.json({ success: true, data: sliced })
    response.headers.set("Cache-Control", "s-maxage=60, stale-while-revalidate=300")
    return response
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const created = await createProject(body as Project)
    const response = NextResponse.json({ success: true, data: created }, { status: 201 })
    response.headers.set("Cache-Control", "no-store")
    return response
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    )
  }
}
