import ClientForm from "@/components/client-form"

interface EditClientPageProps {
  params: Promise<{ id: string }>
}

export default async function EditClientPage({ params }: EditClientPageProps) {
  const { id } = await params

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[#064E3B] text-3xl font-bold text-black">Edit Client</h1>
        <p className="text-black mt-2">Update client information</p>
      </div>
      <ClientForm clientId={id} />
    </div>
  )
}
