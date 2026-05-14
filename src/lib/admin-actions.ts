/**
 * Server Actions for Admin Operations
 * These are server-side functions that can be called from client components
 * Provides alternative to API routes for admin operations
 */

"use server"

import { getAdminFromCookies } from "@/lib/auth"
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "@/lib/github/project-operations"
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "@/lib/github/event-operations"
import { RealEstateProject, SabitEvent, ApiResponse } from "@/types"
import { revalidatePath } from "next/cache"

/**
 * PROJECTS
 */

export async function getProjectsAction(): Promise<RealEstateProject[]> {
  const admin = await getAdminFromCookies()
  if (!admin) throw new Error("Unauthorized")
  return getProjects()
}

export async function createProjectAction(
  project: RealEstateProject
): Promise<ApiResponse<RealEstateProject>> {
  const admin = await getAdminFromCookies()
  if (!admin) throw new Error("Unauthorized")

  const result = await createProject(project)
  if (result.success) {
    revalidatePath("/admin/projects")
    revalidatePath("/projects")
  }
  return result
}

export async function updateProjectAction(
  id: string,
  updates: Partial<RealEstateProject>
): Promise<ApiResponse<RealEstateProject>> {
  const admin = await getAdminFromCookies()
  if (!admin) throw new Error("Unauthorized")

  const result = await updateProject(id, updates)
  if (result.success) {
    revalidatePath("/admin/projects")
    revalidatePath("/projects")
  }
  return result
}

export async function deleteProjectAction(id: string): Promise<ApiResponse> {
  const admin = await getAdminFromCookies()
  if (!admin) throw new Error("Unauthorized")

  const result = await deleteProject(id)
  if (result.success) {
    revalidatePath("/admin/projects")
    revalidatePath("/projects")
  }
  return result
}

/**
 * EVENTS
 */

export async function getEventsAction(): Promise<SabitEvent[]> {
  const admin = await getAdminFromCookies()
  if (!admin) throw new Error("Unauthorized")
  return getEvents()
}

export async function createEventAction(event: SabitEvent): Promise<ApiResponse<SabitEvent>> {
  const admin = await getAdminFromCookies()
  if (!admin) throw new Error("Unauthorized")

  const result = await createEvent(event)
  if (result.success) {
    revalidatePath("/admin/events")
    revalidatePath("/events")
  }
  return result
}

export async function updateEventAction(
  id: string,
  updates: Partial<SabitEvent>
): Promise<ApiResponse<SabitEvent>> {
  const admin = await getAdminFromCookies()
  if (!admin) throw new Error("Unauthorized")

  const result = await updateEvent(id, updates)
  if (result.success) {
    revalidatePath("/admin/events")
    revalidatePath("/events")
  }
  return result
}

export async function deleteEventAction(id: string): Promise<ApiResponse> {
  const admin = await getAdminFromCookies()
  if (!admin) throw new Error("Unauthorized")

  const result = await deleteEvent(id)
  if (result.success) {
    revalidatePath("/admin/events")
    revalidatePath("/events")
  }
  return result
}
