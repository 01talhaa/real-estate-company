import { getManagementTeam } from "@/lib/management"
import ManagementClientPage from "./management-client-page"

export default async function AdminManagementPage() {
  const members = await getManagementTeam()

  return <ManagementClientPage members={members} />
}
