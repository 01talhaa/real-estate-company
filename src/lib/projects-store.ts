import fs from "fs/promises"
import path from "path"
import type { RealEstateProject, ApiResponse } from "@/types"

const PROJECTS_FILE = path.resolve(process.cwd(), "data", "projects.json")

async function readProjectsFile(): Promise<RealEstateProject[]> {
  try {
    const raw = await fs.readFile(PROJECTS_FILE, "utf8")
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as RealEstateProject[]) : []
  } catch (error) {
    return []
  }
}

async function writeProjectsFile(projects: RealEstateProject[]): Promise<void> {
  await fs.mkdir(path.dirname(PROJECTS_FILE), { recursive: true })
  await fs.writeFile(PROJECTS_FILE, JSON.stringify(projects, null, 2), "utf8")
}

export async function getProjects(): Promise<RealEstateProject[]> {
  return readProjectsFile()
}

export async function getProjectById(id: string): Promise<RealEstateProject | null> {
  const projects = await readProjectsFile()
  return projects.find((project) => project.id === id || project.slug === id) ?? null
}

function normalizeProject(project: RealEstateProject): RealEstateProject {
  return {
    ...project,
    gallery: project.gallery ?? [],
    nearbyPlaces: project.nearbyPlaces ?? [],
    status: project.status,
  }
}

export async function saveProject(project: RealEstateProject): Promise<ApiResponse<RealEstateProject>> {
  try {
    const projects = await readProjectsFile()
    const normalized = normalizeProject(project)
    const index = projects.findIndex((item) => item.id === normalized.id || item.slug === normalized.slug)

    if (index >= 0) {
      projects[index] = normalized
    } else {
      projects.push(normalized)
    }

    await writeProjectsFile(projects)

    return {
      success: true,
      data: normalized,
      message: index >= 0 ? "Project updated" : "Project created",
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save project"
    return { success: false, error: message }
  }
}

export async function deleteProject(id: string): Promise<ApiResponse> {
  try {
    const projects = await readProjectsFile()
    const filtered = projects.filter((project) => project.id !== id && project.slug !== id)

    if (filtered.length === projects.length) {
      return { success: false, error: "Project not found" }
    }

    await writeProjectsFile(filtered)

    return { success: true, message: "Project deleted" }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete project"
    return { success: false, error: message }
  }
}
