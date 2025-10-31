import ClientForm from "@/components/client-form"

export default function NewClientPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[#064E3B] text-3xl font-bold text-black">Add New Client</h1>
        <p className="text-black mt-2">Create a new client account</p>
      </div>
      <ClientForm />
    </div>
  )
}
