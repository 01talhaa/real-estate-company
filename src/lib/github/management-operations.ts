/**
 * Management team CRUD operations via GitHub API
 */

import fs from "fs/promises"
import path from "path"
import { ApiResponse, BilingualText } from "@/types"
import { getGitHubClient } from "./client"

export interface ManagementMember {
  id: string
  name: BilingualText
  role: BilingualText
  bio: BilingualText
  department: BilingualText
  image: string
  linkedin?: string
  createdAt?: string
  updatedAt?: string
}

const MANAGEMENT_PATH = "data/management-team.json"
const LOCAL_MANAGEMENT_PATH = path.resolve(process.cwd(), "data", "management-team.json")

async function readLocalManagementTeam(): Promise<ManagementMember[]> {
  try {
    const content = await fs.readFile(LOCAL_MANAGEMENT_PATH, "utf8")
    const parsed = JSON.parse(content)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

async function writeLocalManagementTeam(members: ManagementMember[]) {
  await fs.mkdir(path.dirname(LOCAL_MANAGEMENT_PATH), { recursive: true })
  await fs.writeFile(LOCAL_MANAGEMENT_PATH, JSON.stringify(members, null, 2), "utf8")
}

export async function getManagementTeam(): Promise<ManagementMember[]> {
  try {
    const client = getGitHubClient()
    const members = await client.getJSON<ManagementMember[]>(MANAGEMENT_PATH)
    return Array.isArray(members) ? members : []
  } catch (error) {
    console.error("Error fetching management team:", error)

    if (process.env.NODE_ENV !== "production") {
      try {
        return await readLocalManagementTeam()
      } catch (fsErr) {
        console.error("Local management fallback failed:", fsErr)
      }
    }

    return []
  }
}

export async function getManagementMemberById(id: string): Promise<ManagementMember | null> {
  try {
    const members = await getManagementTeam()
    return members.find((member) => member.id === id) || null
  } catch (error) {
    console.error(`Error fetching management member ${id}:`, error)
    return null
  }
}

export async function createManagementMember(member: ManagementMember): Promise<ApiResponse<ManagementMember>> {
  const newMember: ManagementMember = {
    ...member,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  try {
    const client = getGitHubClient()
    const members = await getManagementTeam()

    if (members.some((existing) => existing.id === member.id)) {
      return { success: false, error: "Management member with this ID already exists" }
    }

    const updatedMembers = [...members, newMember]
    await client.updateJSON(MANAGEMENT_PATH, updatedMembers, `Create management member: ${member.name.en}`)
    await client.triggerRedeploy(process.env.VERCEL_REDEPLOY_WEBHOOK)

    return { success: true, data: newMember, message: "Management member created successfully" }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to create management member"

    if (process.env.NODE_ENV !== "production") {
      try {
        const members = await readLocalManagementTeam()
        if (members.some((existing) => existing.id === member.id)) {
          return { success: false, error: "Management member with this ID already exists" }
        }

        const updatedMembers = [...members, newMember]
        await writeLocalManagementTeam(updatedMembers)

        return { success: true, data: newMember, message: "Management member saved locally (GitHub access unavailable)." }
      } catch (fsErr) {
        console.error("Local management fallback write failed:", fsErr)
      }
    }

    return { success: false, error: errorMessage }
  }
}

export async function updateManagementMember(id: string, updates: Partial<ManagementMember>): Promise<ApiResponse<ManagementMember>> {
  try {
    const client = getGitHubClient()
    const members = await getManagementTeam()

    const memberIndex = members.findIndex((member) => member.id === id)
    if (memberIndex === -1) {
      return { success: false, error: "Management member not found" }
    }

    const updatedMember: ManagementMember = {
      ...members[memberIndex],
      ...updates,
      id: members[memberIndex].id,
      createdAt: members[memberIndex].createdAt,
      updatedAt: new Date().toISOString(),
    }

    members[memberIndex] = updatedMember
    await client.updateJSON(MANAGEMENT_PATH, members, `Update management member: ${id}`)
    await client.triggerRedeploy(process.env.VERCEL_REDEPLOY_WEBHOOK)

    return { success: true, data: updatedMember, message: "Management member updated successfully" }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to update management member"

    if (process.env.NODE_ENV !== "production") {
      try {
        const members = await readLocalManagementTeam()
        const memberIndex = members.findIndex((member) => member.id === id)
        if (memberIndex === -1) {
          return { success: false, error: "Management member not found" }
        }

        const updatedMember: ManagementMember = {
          ...members[memberIndex],
          ...updates,
          id: members[memberIndex].id,
          createdAt: members[memberIndex].createdAt,
          updatedAt: new Date().toISOString(),
        }

        members[memberIndex] = updatedMember
        await writeLocalManagementTeam(members)

        return { success: true, data: updatedMember, message: "Management member updated locally (GitHub access unavailable)." }
      } catch (fsErr) {
        console.error("Local management fallback update failed:", fsErr)
      }
    }

    return { success: false, error: errorMessage }
  }
}

export async function deleteManagementMember(id: string): Promise<ApiResponse> {
  try {
    const client = getGitHubClient()
    const members = await getManagementTeam()

    const member = members.find((item) => item.id === id)
    if (!member) {
      return { success: false, error: "Management member not found" }
    }

    const updatedMembers = members.filter((item) => item.id !== id)
    await client.updateJSON(MANAGEMENT_PATH, updatedMembers, `Delete management member: ${id}`)
    await client.triggerRedeploy(process.env.VERCEL_REDEPLOY_WEBHOOK)

    return { success: true, message: `Management member "${member.name.en}" deleted successfully` }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to delete management member"

    if (process.env.NODE_ENV !== "production") {
      try {
        const members = await readLocalManagementTeam()
        const member = members.find((item) => item.id === id)
        if (!member) {
          return { success: false, error: "Management member not found" }
        }

        await writeLocalManagementTeam(members.filter((item) => item.id !== id))

        return { success: true, message: `Management member "${member.name.en}" deleted locally (GitHub access unavailable).` }
      } catch (fsErr) {
        console.error("Local management fallback delete failed:", fsErr)
      }
    }

    return { success: false, error: errorMessage }
  }
}

export async function getDepartments(): Promise<Array<{ en: string; bn: string }>> {
  const members = await getManagementTeam()
  const seen = new Set<string>()
  const all = { en: "All Departments", bn: "সকল বিভাগ" }
  const departments: Array<{ en: string; bn: string }> = [all]

  for (const member of members) {
    if (!seen.has(member.department.en)) {
      seen.add(member.department.en)
      departments.push(member.department)
    }
  }

  return departments
}