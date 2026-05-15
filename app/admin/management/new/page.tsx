import ManagementForm from "@/components/management-form"

export default function NewManagementMemberPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ManagementForm mode="create" />
    </div>
  )
}
