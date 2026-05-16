import { getEventsCached } from "@/lib/events"
import EventsClientPage from "./events-client-page"

export default async function AdminEventsPage() {
  const events = await getEventsCached()

  return <EventsClientPage events={events} />
}
