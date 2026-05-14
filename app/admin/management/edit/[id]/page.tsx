import ManagementForm from "@/components/management-form"

export default function EditManagementPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-950">Edit Management Member</h1>
        <p className="mt-2 text-sm text-slate-500">Update the selected management profile.</p>
      </div>
      <ManagementForm mode="edit" memberId={params.id} />
    </div>
  )
}
