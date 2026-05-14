import ManagementForm from "@/components/management-form"

export default function NewManagementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-950">Add Management Member</h1>
        <p className="mt-2 text-sm text-slate-500">Create a new bilingual management profile.</p>
      </div>
      <ManagementForm mode="create" />
    </div>
  )
}
