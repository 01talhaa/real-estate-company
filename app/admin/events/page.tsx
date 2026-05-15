import { getEvents } from "./actions"
import EventsClientPage from "./events-client-page"

export default async function AdminEventsPage() {
  const events = await getEvents()

  return <EventsClientPage events={events} />
}
