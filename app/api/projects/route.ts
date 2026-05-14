import { NextRequest, NextResponse } from "next/server"
import { getProjects, saveProject } from "@/src/lib/projects-store"
import type { RealEstateProject } from "@/types"

// GET /api/projects - List all projects
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = searchParams.get('limit')
    const page = searchParams.get('page') || '1'
    const projects = await getProjects()
    const filtered = status ? projects.filter((project) => project.status === status) : projects
    const sliced = limit
      ? filtered.slice((parseInt(page) - 1) * parseInt(limit), (parseInt(page) - 1) * parseInt(limit) + parseInt(limit))
      : filtered

    return NextResponse.json({ success: true, data: sliced })
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
    const result = await saveProject(body as RealEstateProject)
    return NextResponse.json(result, { status: result.success ? 201 : 400 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    )
  }
}
