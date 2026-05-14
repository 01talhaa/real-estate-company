/**
 * Project CRUD operations via GitHub API
 */

import { RealEstateProject, ApiResponse } from "@/types"
import { getGitHubClient } from "./client"
import fs from "fs/promises"
import path from "path"

const PROJECTS_PATH = "data/projects.json"

/**
 * Get all projects
 */
export async function getProjects(): Promise<RealEstateProject[]> {
  try {
    const client = getGitHubClient()
    const projects = await client.getJSON<RealEstateProject[]>(PROJECTS_PATH)
    return Array.isArray(projects) ? projects : []
  } catch (error) {
    console.error("Error fetching projects:", error)

    // Development fallback: read local file if GitHub access fails
    if (process.env.NODE_ENV !== "production") {
      try {
        const localPath = path.resolve(process.cwd(), "data", "projects.json")
        const content = await fs.readFile(localPath, "utf8")
        const parsed = JSON.parse(content)
        return Array.isArray(parsed) ? parsed : []
      } catch (fsErr) {
        console.error("Local fallback failed:", fsErr)
        return []
      }
    }

    return []
  }
}

/**
 * Get project by ID
 */
export async function getProjectById(id: string): Promise<RealEstateProject | null> {
  try {
    const projects = await getProjects()
    return projects.find((p) => p.id === id) || null
  } catch (error) {
    console.error(`Error fetching project ${id}:`, error)
    return null
  }
}

/**
 * Create new project
 */
export async function createProject(project: RealEstateProject): Promise<ApiResponse<RealEstateProject>> {
  const newProject: RealEstateProject = {
    ...project,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  try {
    const client = getGitHubClient()
    const projects = await getProjects()

    // Check if project with same ID already exists
    if (projects.some((p) => p.id === project.id)) {
      return {
        success: false,
        error: "Project with this ID already exists",
      }
    }

    const updatedProjects = [...projects, newProject]

    await client.updateJSON(
      PROJECTS_PATH,
      updatedProjects,
      `Create project: ${project.name.en}`
    )

    // Trigger Vercel redeploy
    await client.triggerRedeploy(process.env.VERCEL_REDEPLOY_WEBHOOK)

    return {
      success: true,
      data: newProject,
      message: "Project created successfully",
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to create project"

    // If GitHub fails due to token access and we're in development, fallback to local file write
    if (process.env.NODE_ENV !== "production") {
      try {
        const localPath = path.resolve(process.cwd(), "data", "projects.json")
        const existing = await (async () => {
          try {
            const c = await fs.readFile(localPath, "utf8")
            return JSON.parse(c)
          } catch (e) {
            return []
          }
        })()

        const newList = Array.isArray(existing) ? [...existing, newProject] : [newProject]

        await fs.mkdir(path.dirname(localPath), { recursive: true })
        await fs.writeFile(localPath, JSON.stringify(newList, null, 2), "utf8")

        return {
          success: true,
          data: newProject,
          message: "Project saved locally (GitHub access unavailable).",
        }
      } catch (fsErr) {
        console.error("Local fallback write failed:", fsErr)
      }
    }

    return {
      success: false,
      error: errorMessage,
    }
  }
}

/**
 * Update project
 */
export async function updateProject(
  id: string,
  updates: Partial<RealEstateProject>
): Promise<ApiResponse<RealEstateProject>> {
  try {
    const client = getGitHubClient()
    const projects = await getProjects()

    const projectIndex = projects.findIndex((p) => p.id === id)
    if (projectIndex === -1) {
      return {
        success: false,
        error: "Project not found",
      }
    }

    const updatedProject: RealEstateProject = {
      ...projects[projectIndex],
      ...updates,
      id: projects[projectIndex].id,
      slug: projects[projectIndex].slug,
      createdAt: projects[projectIndex].createdAt,
      updatedAt: new Date().toISOString(),
    }

    projects[projectIndex] = updatedProject

    await client.updateJSON(PROJECTS_PATH, projects, `Update project: ${id}`)

    // Trigger Vercel redeploy
    await client.triggerRedeploy(process.env.VERCEL_REDEPLOY_WEBHOOK)

    return {
      success: true,
      data: updatedProject,
      message: "Project updated successfully",
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to update project"

    if (process.env.NODE_ENV !== "production") {
      try {
        const localPath = path.resolve(process.cwd(), "data", "projects.json")
        const existing = await (async () => {
          try {
            const c = await fs.readFile(localPath, "utf8")
            return JSON.parse(c)
          } catch (e) {
            return []
          }
        })()

        if (!Array.isArray(existing)) {
          return { success: false, error: errorMessage }
        }

        const idx = existing.findIndex((p: any) => p.id === id)
        if (idx === -1) {
          return { success: false, error: "Project not found" }
        }

        existing[idx] = { ...existing[idx], ...updates, updatedAt: new Date().toISOString() }

        await fs.writeFile(localPath, JSON.stringify(existing, null, 2), "utf8")

        return { success: true, data: existing[idx], message: "Project updated locally (GitHub access unavailable)." }
      } catch (fsErr) {
        console.error("Local fallback update failed:", fsErr)
      }
    }

    return {
      success: false,
      error: errorMessage,
    }
  }
}

/**
 * Delete project
 */
export async function deleteProject(id: string): Promise<ApiResponse> {
  try {
    const client = getGitHubClient()
    const projects = await getProjects()

    const projectIndex = projects.findIndex((p) => p.id === id)
    if (projectIndex === -1) {
      return {
        success: false,
        error: "Project not found",
      }
    }

    const deletedProject = projects[projectIndex]
    const updatedProjects = projects.filter((p) => p.id !== id)

    await client.updateJSON(PROJECTS_PATH, updatedProjects, `Delete project: ${id}`)

    // Trigger Vercel redeploy
    await client.triggerRedeploy(process.env.VERCEL_REDEPLOY_WEBHOOK)

    return {
      success: true,
      message: `Project "${deletedProject.name.en}" deleted successfully`,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to delete project"

    if (process.env.NODE_ENV !== "production") {
      try {
        const localPath = path.resolve(process.cwd(), "data", "projects.json")
        const existing = await (async () => {
          try {
            const c = await fs.readFile(localPath, "utf8")
            return JSON.parse(c)
          } catch (e) {
            return []
          }
        })()

        if (!Array.isArray(existing)) {
          return { success: false, error: errorMessage }
        }

        const newList = existing.filter((p: any) => p.id !== id)
        await fs.writeFile(localPath, JSON.stringify(newList, null, 2), "utf8")

        return { success: true, message: `Project deleted locally (GitHub access unavailable).` }
      } catch (fsErr) {
        console.error("Local fallback delete failed:", fsErr)
      }
    }

    return {
      success: false,
      error: errorMessage,
    }
  }
}

/**
 * Get projects by status
 */
export async function getProjectsByStatus(status: "handover" | "ongoing" | "upcoming"): Promise<RealEstateProject[]> {
  try {
    const projects = await getProjects()
    return projects.filter((p) => p.status === status)
  } catch (error) {
    console.error("Error filtering projects:", error)
    return []
  }
}
