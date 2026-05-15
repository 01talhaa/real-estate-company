import { notFound } from "next/navigation"
import EventForm from "@/components/event-form"
import { getEvents } from "@/lib/events"

export default async function EditEventPage({ params }: { params: { id: string } }) {
  const events = await getEvents()
  const event = events.find((p) => p.id === params.id)

  if (!event) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <EventForm mode="edit" eventId={event.id} initialData={event} />
    </div>
  )
}
