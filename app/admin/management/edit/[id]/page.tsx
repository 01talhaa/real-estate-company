import { notFound } from "next/navigation"
import ManagementForm from "@/components/management-form"
import { getManagementTeam } from "@/lib/management"

export default async function EditManagementMemberPage({ params }: { params: { id: string } }) {
  const team = await getManagementTeam()
  const member = team.find((m) => m.id === params.id)

  if (!member) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ManagementForm mode="edit" memberId={member.id} initialData={member} />
    </div>
  )
}
