import EventForm from "@/components/event-form"

export default function NewEventPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <EventForm mode="create" />
    </div>
  )
}
