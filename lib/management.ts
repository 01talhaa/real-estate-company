import { getGithubFile, updateGithubFile } from "./github"
import { ManagementMember, ManagementMemberSchema } from "@/types/management"
import { z } from "zod"

const MANAGEMENT_FILE_PATH = "data/management-team.json"

const ManagementTeamSchema = z.array(ManagementMemberSchema)

export async function getManagementTeam(): Promise<ManagementMember[]> {
  const file = await getGithubFile(MANAGEMENT_FILE_PATH)
  if (!file) {
    console.log("Management file not found, returning empty array")
    return []
  }
  const team = JSON.parse(file.content)
  // Sort by order
  team.sort((a: ManagementMember, b: ManagementMember) => (a.order || 0) - (b.order || 0));
  return ManagementTeamSchema.parse(team)
}

export async function createManagementMember(member: ManagementMember): Promise<void> {
  const team = await getManagementTeam()
  
  const memberWithTimestamps = {
    ...member,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const newTeam = [...team, memberWithTimestamps]
  const content = JSON.stringify(newTeam, null, 2)
  const file = await getGithubFile(MANAGEMENT_FILE_PATH)
  await updateGithubFile(MANAGEMENT_FILE_PATH, content, file?.sha)
}

export async function updateManagementMember(updatedMember: ManagementMember): Promise<void> {
  const team = await getManagementTeam()
  
  const memberWithTimestamps = {
    ...updatedMember,
    updatedAt: new Date().toISOString(),
  }

  const newTeam = team.map((member) => (member.id === updatedMember.id ? memberWithTimestamps : member))
  const content = JSON.stringify(newTeam, null, 2)
  const file = await getGithubFile(MANAGEMENT_FILE_PATH)
  if (!file) throw new Error("Management data file not found on GitHub.")
  await updateGithubFile(MANAGEMENT_FILE_PATH, content, file.sha)
}

export async function deleteManagementMember(id: string): Promise<void> {
  const team = await getManagementTeam()
  const newTeam = team.filter((member) => member.id !== id)
  const content = JSON.stringify(newTeam, null, 2)
  const file = await getGithubFile(MANAGEMENT_FILE_PATH)
  if (!file) throw new Error("Management data file not found on GitHub.")
  await updateGithubFile(MANAGEMENT_FILE_PATH, content, file.sha)
}
