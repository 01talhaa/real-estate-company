import dbConnect from "./mongoose"
import ManagementModel from "./models/ManagementModel"
import { apiCache, CacheTTL, withCache } from "./cache"
import { revalidateTag, unstable_cache } from "next/cache"
import { ManagementMember } from "@/types/management"

const MANAGEMENT_CACHE_KEY = "management:all"

function serializeMember(doc: any): ManagementMember {
  const obj = doc?.toObject ? doc.toObject() : doc
  if (obj?._id) delete obj._id
  if (obj?.__v !== undefined) delete obj.__v
  return obj as ManagementMember
}

export async function getManagementTeam(): Promise<ManagementMember[]> {
  await dbConnect()
  return withCache(
    MANAGEMENT_CACHE_KEY,
    async () => {
      const members = await ManagementModel.find().sort({ order: 1, createdAt: 1 }).lean()
      return members.map(serializeMember)
    },
    CacheTTL.MEDIUM
  )
}

export const getManagementTeamCached = unstable_cache(
  async () => getManagementTeam(),
  ["management:all"],
  { revalidate: 60, tags: ["management"] }
)

export async function getManagementMemberById(id: string): Promise<ManagementMember | null> {
  await dbConnect()
  const cacheKey = `management:${id}`
  return withCache(
    cacheKey,
    async () => {
      const member = await ManagementModel.findOne({ id }).lean()
      return member ? serializeMember(member) : null
    },
    CacheTTL.MEDIUM
  )
}

export async function getManagementMemberByIdCached(id: string): Promise<ManagementMember | null> {
  return unstable_cache(
    async () => getManagementMemberById(id),
    ["management", id],
    { revalidate: 60, tags: ["management"] }
  )()
}

export async function createManagementMember(member: ManagementMember): Promise<ManagementMember> {
  await dbConnect()
  const now = new Date().toISOString()
  const payload = {
    ...member,
    createdAt: member.createdAt ?? now,
    updatedAt: member.updatedAt ?? now,
  }
  const created = await ManagementModel.create(payload)
  apiCache.delete(MANAGEMENT_CACHE_KEY)
  apiCache.delete(`management:${member.id}`)
  revalidateTag("management")
  return serializeMember(created)
}

export async function updateManagementMember(updatedMember: ManagementMember): Promise<ManagementMember> {
  await dbConnect()
  const payload = {
    ...updatedMember,
    updatedAt: new Date().toISOString(),
  }
  const updated = await ManagementModel.findOneAndUpdate({ id: updatedMember.id }, payload, { new: true })
  if (!updated) throw new Error("Management member not found")
  apiCache.delete(MANAGEMENT_CACHE_KEY)
  apiCache.delete(`management:${updatedMember.id}`)
  revalidateTag("management")
  return serializeMember(updated)
}

export async function deleteManagementMember(id: string): Promise<{ success: boolean }> {
  await dbConnect()
  await ManagementModel.findOneAndDelete({ id })
  apiCache.delete(MANAGEMENT_CACHE_KEY)
  apiCache.delete(`management:${id}`)
  revalidateTag("management")
  return { success: true }
}
