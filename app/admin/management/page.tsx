import { getManagementTeamCached } from "@/lib/management"
import ManagementClientPage from "./management-client-page"

export default async function AdminManagementPage() {
  const members = await getManagementTeamCached()

  return <ManagementClientPage members={members} />
}
