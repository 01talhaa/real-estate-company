import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getProjectById, saveProject, deleteProject } from "@/src/lib/projects-store"

async function isAuthenticated() {
  const cookieStore = await cookies()
  return cookieStore.get("admin-session")?.value === "authenticated"
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const project = await getProjectById(id)

  if (!project) {
    return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 })
  }

  return NextResponse.json({ success: true, data: project }, { status: 200 })
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()
  const existing = await getProjectById(id)
  const result = await saveProject({ ...(existing ?? {}), ...body, id } as any)
  return NextResponse.json(result, { status: result.success ? 200 : 400 })
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const result = await deleteProject(id)
  return NextResponse.json(result, { status: result.success ? 200 : 400 })
}
