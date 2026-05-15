"use server"

import { revalidatePath } from "next/cache"
import {
  createManagementMember as apiCreateManagementMember,
  updateManagementMember as apiUpdateManagementMember,
  deleteManagementMember as apiDeleteManagementMember,
} from "@/lib/management"
import { ManagementMember, ManagementMemberSchema } from "@/types/management"

export async function createManagementMember(memberData: ManagementMember) {
  const validatedFields = ManagementMemberSchema.safeParse(memberData)

  if (!validatedFields.success) {
    throw new Error(`Validation Error: ${JSON.stringify(validatedFields.error.flatten().fieldErrors)}`)
  }

  try {
    await apiCreateManagementMember(validatedFields.data)
    revalidatePath("/admin/management")
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "An unknown error occurred")
  }
}

export async function updateManagementMember(memberData: ManagementMember) {
  const validatedFields = ManagementMemberSchema.safeParse(memberData)

  if (!validatedFields.success) {
    throw new Error(`Validation Error: ${JSON.stringify(validatedFields.error.flatten().fieldErrors)}`)
  }

  try {
    await apiUpdateManagementMember(validatedFields.data)
    revalidatePath("/admin/management")
    revalidatePath(`/admin/management/edit/${validatedFields.data.id}`)
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "An unknown error occurred")
  }
}

export async function deleteManagementMemberAction(id: string) {
  try {
    await apiDeleteManagementMember(id)
    revalidatePath("/admin/management")
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "An unknown error occurred")
  }
}
